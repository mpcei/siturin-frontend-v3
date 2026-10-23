import { Component, effect, inject, input, output, signal } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ButtonModule } from 'primeng/button';
import { RegulationHttpService } from '@modules/core/shared/services/regulation-http.service';
import {
    RegulationItemInterface,
    RegulationResponseInterface,
    RegulationSectionInterface
} from '@modules/core/shared/interfaces';
import { ValidationTypeEnum } from '../regulation-simulator/enum';
import { Divider } from 'primeng/divider';
import { Fluid } from 'primeng/fluid';
import { Message } from 'primeng/message';
import { Tag } from 'primeng/tag';
import { PrimeIcons } from 'primeng/api';
import { CatalogueActivitiesCodeEnum } from '@/utils/enums';
import { CategoryConfigurationsHttpService } from '../../services/category-configurations.http.service';
import { CategoryConfigurationInterface } from '@/pages/core/shared/interfaces/category-configuration.interface';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';
import { MaximoConfigracionCategoriaPipe } from '@shared/pipes/siturin/maximo-configracion-categoria.pipe';
import { environment } from '@env/environment';

@Component({
    selector: 'app-regulation',
    imports: [ReactiveFormsModule, ToggleSwitchModule, ButtonModule, Divider, Fluid, Message, Tag, ToggleSwitchComponent, MaximoConfigracionCategoriaPipe],
    templateUrl: './regulation.component.html'
})
export class RegulationComponent {
    dataOut = output<Record<string, any>>();

    private readonly regulationHttpService = inject(RegulationHttpService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly categoryConfigurationsHttpService = inject(CategoryConfigurationsHttpService);

    protected validationTypeEnum = ValidationTypeEnum;
    modelId = input.required<string | undefined>();
    isProtectedArea = input<boolean>(false);
    isAdventureRequirement = input<boolean>(false);
    activityCode = input<string | undefined>();
    totalScore = signal<number>(0);
    totalAverageScore = signal<number>(0);
    totalCategoryScore = signal<number>(0);

    protected form!: FormGroup;
    protected sections = signal<RegulationSectionInterface[]>([]);
    protected categoryConfigurations: CategoryConfigurationInterface[] = [];
    private errorMessages: string[] = [];

    private readonly loadRegulations = effect(() => {
        this.totalScore.set(0);
        this.totalAverageScore.set(0);
        this.totalCategoryScore.set(0);

        if (this.modelId()?.length === 0) return this.sections.set([]);

        if (this.isAdventureRequirement()) {
            this.regulationHttpService.getRegulationsAdventureTourismModalityByModelId(this.modelId()!).subscribe((resp) => {
                this.sections.set(resp);
            });
        } else {
            this.regulationHttpService.getRegulationsByModelId(this.modelId()!).subscribe((resp) => {
                this.sections.set(resp);
            });
        }
    });

    private readonly loadCategories = effect(() => {
        if (!this.activityCode() || (this.activityCode() !== CatalogueActivitiesCodeEnum.food_drink_continent && this.activityCode() !== CatalogueActivitiesCodeEnum.food_drink_galapagos)) return (this.categoryConfigurations = []);

        if (this.modelId()?.length === 0) return (this.categoryConfigurations = []);

        return this.categoryConfigurationsHttpService.findByClassificationId(this.modelId()!).subscribe((resp) => {
            this.categoryConfigurations = resp;
        });
    });

    buildForm = effect(() => {
        const regularSections = this.sections().filter((section) => !section.isProtectedArea);

        this.form = this.formBuilder.group({
            regulation: [[]],
            category: [{ value: null, disabled: true }], // activo cuando sea alimentos y bebidas
            sections: this.formBuilder.array(regularSections.map((section) => this.createSectionGroup(section)))
        });

        this.form.valueChanges.subscribe((_) => {
            this.getFormErrors();

            if (this.errorMessages.length === 0) {
                this.dataOut.emit({ regulation: this.formattedResult });
            }
        });
    });

    createSectionGroup(section: RegulationSectionInterface): FormGroup {
        return this.formBuilder.group({
            id: [section.id],
            name: [section.name],
            validationType: [section.validationType],
            isProtectedArea: [section.isProtectedArea],
            minimumItems: [section.minimumItems],
            items: this.formBuilder.array(
                section.items.map((item) =>
                    this.formBuilder.group({
                        id: [item.id],
                        name: [item.name],
                        isCompliant: [false],
                        isMandatory: [item.required],
                        score: [item.score],
                        downloadable: [item.downloadable],
                        downloadableCode: [item.downloadableCode]
                    })
                )
            )
        });
    }

    onIsProtectedAreaChanges = effect(() => {
        const protectedSections = this.sections().filter((section) => section.isProtectedArea);

        if (this.isProtectedArea()) {
            this.addProtectedAreaSections(protectedSections);
        } else {
            this.removeProtectedAreaSections(protectedSections);
        }
    });

    addProtectedAreaSections(protectedSections: RegulationSectionInterface[]) {
        protectedSections.forEach((section) => {
            const exists = this.sectionsField.value.some((s: any) => s.id === section.id);

            if (!exists) this.sectionsField.push(this.createSectionGroup(section));
        });
    }

    removeProtectedAreaSections(protectedSections: RegulationSectionInterface[]) {
        protectedSections.forEach((section) => {
            const index = this.sectionsField.controls.findIndex((control) => control.value.id === section.id);

            if (index !== -1) this.sectionsField.removeAt(index);
        });
    }

    get formattedResult(): RegulationResponseInterface {
        const regulationResponses = this.form.value.sections.flatMap((section: RegulationSectionInterface) => {
            return section.items.map((item) => ({
                id: item.id,
                score: item.score,
                isCompliant: item.isCompliant
            }));
        });

        const category = this.categoryField.value;

        return { regulationResponses, category };
    }

    getFormErrors() {
        this.errorMessages = [];

        this.sectionsField.controls.forEach((sectionControl, index) => {
            const section = this.sections()[index];
            if (section.isProtectedArea && !this.isProtectedArea()) return;

            const selectedItems = this.getRegulationItemsField(index).value.filter((item: RegulationItemInterface) => item.isCompliant);

            switch (section.validationType) {
                case 'REQUIRED_ITEMS':
                    this.validateRequiredItems(section, selectedItems);
                    break;
                case 'MINIMUM_ITEMS':
                    this.validateMinimumItems(section, selectedItems);
                    break;
                case 'SCORE_BASED':
                    this.validateScoreBased(selectedItems);
                    break;
            }
        });

        return this.errorMessages;
    }

    validateRequiredItems(section: RegulationSectionInterface, selectedItems: RegulationItemInterface[]): boolean {
        const requiredItems = section.items.filter((item) => item.required);
        const selectedItemIds = new Set(selectedItems.map((item) => item.id));
        const allRequiredSelected = requiredItems.every((item) => selectedItemIds.has(item.id));

        if (!allRequiredSelected) {
            this.errorMessages.push(`La sección ${section.name} no cumple con los requisitos obligatorios.`);
        }

        return allRequiredSelected;
    }

    validateMinimumItems(section: RegulationSectionInterface, selectedItems: RegulationItemInterface[]): boolean {
        const minimumRequired = section.minimumItems ?? 0;
        const meetsMinimum = selectedItems.length >= minimumRequired;

        if (!meetsMinimum) {
            this.errorMessages.push(`La sección ${section.name} no cumple con el número mínimo de elementos. ` + `Seleccionados: ${selectedItems.length}, mínimo: ${minimumRequired}`);
        }

        const allRequiredSelected = this.validateRequiredItems(section, selectedItems);
        return meetsMinimum && allRequiredSelected;
    }

    validateScoreBased(selectedItems: RegulationItemInterface[]) {
        this.totalScore.set(selectedItems.reduce((sum, item) => sum + (item.score ?? 0), 0));
        const sortedCategories = [...this.categoryConfigurations].sort((a, b) => a.min - b.min);
        const sections = this.sectionsField.value as Array<RegulationSectionInterface>;
        const items = sections.find(item => item.validationType === 'SCORE_BASED').items;
        this.totalCategoryScore.set(items.reduce((sum, item) => sum + (item.score ?? 0), 0));

        this.totalAverageScore.set((this.totalScore() * 100 / this.totalCategoryScore()));

        let selectedCategory = null;

        for (const categoryConfig of sortedCategories) {
            if (this.totalAverageScore() >= categoryConfig.min) {
                selectedCategory = categoryConfig;
            }
        }

        this.setCategory(selectedCategory);

        if (!selectedCategory) {
            this.errorMessages.push('No es suficiente para aplicar por una categoría de turismo.');
        }
    }

    setCategory(categoryConfiguration: CategoryConfigurationInterface) {
        if (categoryConfiguration) {
            this.categoryField.enable({
                emitEvent: false
            });
            this.categoryField.setValue(categoryConfiguration.category, {
                emitEvent: false
            });
        } else {
            this.categoryField.setValue(null, {
                emitEvent: false
            });
            this.categoryField.disable({
                emitEvent: false
            });
        }
    }

    get sectionsField(): FormArray {
        return this.form.get('sections') as FormArray;
    }

    get categoryField(): AbstractControl {
        return this.form.controls['category'];
    }

    getRegulationItemsField(sectionIndex: number): FormArray {
        return this.sectionsField.at(sectionIndex).get('items') as FormArray;
    }

    protected readonly PrimeIcons = PrimeIcons;

    downloadDocument(code: string) {
        switch (code) {
            case  'informed_consent':
                window.open('assets/archivos/regulation/informed_consent.pdf');
                break;
        }
    }

    protected readonly environment = environment;
}
