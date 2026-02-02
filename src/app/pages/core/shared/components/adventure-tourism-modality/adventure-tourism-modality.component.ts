import { Component, effect, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fluid } from 'primeng/fluid';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Message } from 'primeng/message';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ListBasicComponent } from '@utils/components/list-basic/list-basic.component';
import { DialogModule } from 'primeng/dialog';
import { CatalogueInterface, ColInterface } from '@utils/interfaces';
import { deleteButtonAction } from '@utils/components/button-action/consts';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { AdventureTourismModalityInterface } from '@modules/core/shared/interfaces';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';

@Component({
    selector: 'app-adventure-tourism-modality',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        Fluid,
        LabelDirective,
        Select,
        ButtonModule,
        TooltipModule,
        Message,
        ErrorMessageDirective,
        ToastModule,
        ConfirmDialogModule,
        ListBasicComponent,
        DialogModule,
        RegulationComponent,
        ToggleSwitchComponent
    ],
    templateUrl: './adventure-tourism-modality.component.html',
    styleUrls: ['./adventure-tourism-modality.component.scss']
})
export class AdventureTourismModalityComponent implements OnInit {
    @Output() dataOut = new EventEmitter<Record<string, any>>();
    @Input() modelId!: string | undefined;

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);

    protected form!: FormGroup;
    protected modalityForm!: FormGroup;

    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: AdventureTourismModalityInterface[] = [];
    protected buttonActions: MenuItem[] = [];

    protected availableModalities: CatalogueInterface[] = [];
    protected classModalities: CatalogueInterface[] = [];
    protected waterModalities: CatalogueInterface[] = [];
    protected landModalities: CatalogueInterface[] = [];
    protected airModalities: CatalogueInterface[] = [];

    constructor() {
        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                if (processSignal.classification?.hasRegulation) this.modelId = processSignal.classification.id;
                if (processSignal.category?.hasRegulation) this.modelId = processSignal.category.id;
            }
        });
    }

    async ngOnInit() {
        this.buildForm();
        this.buildColumns();
        this.loadCatalogues();
    }

    buildButtonActions(item: AdventureTourismModalityInterface) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item) this.deleteAdventureTourismModality(item);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'Clase', field: 'className' },
            { header: 'Modalidad', field: 'type', type: 'object' }
        ];
    }

    buildForm() {
        this.modalityForm = this.formBuilder.group({
            id: [null],
            className: [null, Validators.required],
            type: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            hasAdventureTourismModality: false,
            adventureTourismModalities: [],
            regulation: [null, Validators.required]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form.value);

        this.hasAdventureTourismModalityField.valueChanges.subscribe((value) => {
            this.adventureTourismModalitiesField.setValue(this.items);

            this.dataOut.emit(this.form.value);
        });

        this.classNameField.valueChanges.subscribe((value) => {
            switch (value && value.code) {
                case 'air':
                    this.availableModalities = this.airModalities;
                    break;
                case 'land':
                    this.availableModalities = this.landModalities;
                    break;
                case 'water':
                    this.availableModalities = this.waterModalities;
                    break;
                default:
                    this.availableModalities = [];
            }
        });
    }

    async loadCatalogues() {
        this.classModalities = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities);
        this.airModalities = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_air);
        this.landModalities = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_land);
        this.waterModalities = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_water);
    }

    onSubmit() {
        if (this.validateModalityForm()) {
            this.createAdventureTourismModality();
        }
    }

    validateModalityForm() {
        const errors: string[] = [];

        if (this.classNameField.invalid) errors.push('Clase');
        if (this.typeField.invalid) errors.push('Modalidad');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    getFormErrors() {
        const errors: string[] = [];

        if (this.hasAdventureTourismModalityField.value && this.items.length === 0) errors.push('Modalidades de Turismo Aventura');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    createAdventureTourismModality() {
        const exists = this.items.some((item) => item.type?.code === this.typeField.value?.code);

        if (exists) {
            this.customMessageService.showError({
                summary: 'Aviso',
                detail: 'La modalidad ya fue agregada'
            });
            return;
        }

        this.items.push({
            className: this.classNameField.value.name,
            type: this.typeField.value
        });

        this.adventureTourismModalitiesField.setValue(this.items);

        this.dataOut.emit(this.form.value);

        this.closeModal();
    }

    deleteAdventureTourismModality(modality: AdventureTourismModalityInterface) {
        this.isVisibleModal = false;

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
                this.items = this.items.filter((item) => item.type?.id !== modality.type?.id);

                this.adventureTourismModalitiesField.setValue(this.items);

                this.dataOut.emit(this.form);
            },
            key: 'confirmdialog'
        });
    }

    closeModal() {
        this.isVisibleModal = false;
        this.modalityForm.reset();
    }

    saveForm(data: Record<string, any>) {
        this.regulationField.patchValue(data);
    }

    // Getter Modality Form
    get classNameField(): AbstractControl {
        return this.modalityForm.get('className')!;
    }

    get typeField(): AbstractControl {
        return this.modalityForm.get('type')!;
    }

    // Getters Form
    get hasAdventureTourismModalityField(): AbstractControl {
        return this.form.controls['hasAdventureTourismModality'];
    }

    get adventureTourismModalitiesField(): AbstractControl {
        return this.form.controls['adventureTourismModalities'];
    }

    get regulationField(): AbstractControl {
        return this.form.controls['regulation'];
    }
}
