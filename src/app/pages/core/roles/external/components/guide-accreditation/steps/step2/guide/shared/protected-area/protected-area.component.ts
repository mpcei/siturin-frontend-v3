import { Component, inject, input, OnInit, output, OutputEmitterRef, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fluid } from 'primeng/fluid';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Message } from 'primeng/message';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { DialogModule } from 'primeng/dialog';
import { CatalogueInterface, DpaInterface } from '@utils/interfaces';
import { CustomMessageService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';

export interface AdventureTourismModalityInterface {
    id?: string;
    area?: CatalogueInterface;
    province?: DpaInterface;
    canton?: DpaInterface;
}

@Component({
    selector: 'app-protected-area',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, Fluid, LabelDirective, Select, ButtonModule, TooltipModule, Message, ErrorMessageDirective, ToastModule, ConfirmDialogModule, DialogModule, ToggleSwitchComponent],
    templateUrl: './protected-area.component.html'
})
export class ProtectedAreaComponent implements OnInit {
    public dataOut: OutputEmitterRef<Record<string, any>> = output<Record<string, any>>();
    public classification = input.required<ClassificationInterface>();

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected protectedAreaForm!: FormGroup;

    protected items: AdventureTourismModalityInterface[] = [];

    protected provinces = signal<DpaInterface[]>([]);
    protected cantons: DpaInterface[] = [];
    protected availableModalities: CatalogueInterface[] = [];
    protected certifiers: CatalogueInterface[] = [];
    protected requirements: CatalogueInterface[] = [];
    protected responses: Map<string, any> = new Map<string, any>();

    constructor() {}

    async ngOnInit() {
        this.buildForm();
        await this.loadCatalogues();
    }

    buildForm() {
        this.protectedAreaForm = this.formBuilder.group({
            province: [null, Validators.required],
            canton: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            requirement: [null, Validators.required],
            hasAdventureTourismModality: false,
            adventureTourismModalities: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.hasProtectedAreaField.valueChanges.subscribe((_) => {
            this.updateFormAndEmit();
        });
    }

    async loadCatalogues() {
        const [modalities, certifiers, requirements] = await Promise.all([
            this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_name),
            this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_name), //review cambiar por el catalogo correspondiente
            this.catalogueService.findByType(CatalogueTypeEnum.requirement_item)
        ]);

        this.availableModalities = modalities.filter((x) => x.code !== 'protected_areas_name');
        this.certifiers = certifiers;
        this.requirements = requirements;

        console.log(requirements);
        this.requirementField.patchValue(this.requirements.find((x) => x.code === 'pane')); //review cambiar en la base por adventure
    }

    onSubmit() {
        if (this.validateModalityForm()) {
            this.createItems();
        }
    }

    validateModalityForm() {
        const errors: string[] = [];

        if (this.provinceField.invalid) errors.push('Provincia');
        if (this.cantonField.invalid) errors.push('Cantón');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    getFormErrors() {
        const errors: string[] = [];

        if (this.hasProtectedAreaField.value && this.items.length === 0) errors.push('Áreas Protegidas');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    onSelect({ item, index }: { item: any; index: number }) {
        if (!item) {
            this.customMessageService.showError({ summary: 'El registro no existe', detail: 'Vuelva a intentar' });
            return;
        }
    }

    createItems() {
        this.items = [
            ...this.items,
            {
                province: undefined,
                canton: undefined,
                area: undefined
            }
        ];

        this.updateFormAndEmit();
    }

    deleteAdventureTourismModality(modality: AdventureTourismModalityInterface) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar?',
            header: 'Eliminar',
            icon: PrimeIcons.TRASH,
            rejectButtonStyleClass: 'p-button-text',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'danger',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Eliminar'
            },
            accept: () => {
                this.items = this.items.filter((item) => item.area?.id !== modality?.area?.id);

                this.updateFormAndEmit();
            },
            key: 'confirmdialog'
        });
    }

    onFileSelect(modality: CatalogueInterface, event: any) {
        this.responses.set(modality.code!, {
            modality
        });
    }

    private updateFormAndEmit() {
        this.protectedAreasField.setValue(this.items);
        this.dataOut.emit(this.form.getRawValue());
    }

    // Getters Form
    get requirementField(): AbstractControl {
        return this.form.controls['requirement'];
    }

    get hasProtectedAreaField(): AbstractControl {
        return this.form.controls['hasProtectedArea'];
    }

    get protectedAreasField(): AbstractControl {
        return this.form.controls['protectedAreas'];
    }

    get provinceField(): AbstractControl {
        return this.protectedAreaForm.controls['province'];
    }

    get cantonField(): AbstractControl {
        return this.protectedAreaForm.controls['canton'];
    }
}
