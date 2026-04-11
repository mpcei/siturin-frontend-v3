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
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';
import { FileUpload } from 'primeng/fileupload';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';

export interface AdventureTourismModalityInterface {
    id?: string;
    certifier?: CatalogueInterface;
    type?: CatalogueInterface;
    file?: any;
}

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
        ToggleSwitchComponent,
        FileUpload,
        ButtonActionComponent
    ],
    templateUrl: './adventure-tourism-modality.component.html'
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
    protected isButtonActionsEnabled: boolean = false;

    protected availableModalities: CatalogueInterface[] = [];
    protected classModalities: CatalogueInterface[] = [];
    protected waterModalities: CatalogueInterface[] = [];
    protected landModalities: CatalogueInterface[] = [];
    protected airModalities: CatalogueInterface[] = [];
    protected certifiers: CatalogueInterface[] = [];
    protected responses: Map<string, any> = new Map<string, any>();

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

    buildButtonActions(item: any, index: number) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item) this.deleteAdventureTourismModality(item);
                }
            }
        ];

        this.isButtonActionsEnabled = true;
    }

    buildColumns() {
        this.cols = [
            { header: 'Modalidad', field: 'type', type: 'object' },
            { header: 'Organismos Certificadores', field: 'certifier', type: 'object' },
            { header: 'Certificación de habilidad o el certificado de aprobación', field: 'file', type: 'object' }
        ];
    }

    buildForm() {
        this.modalityForm = this.formBuilder.group({
            id: [null],
            className: [null],
            type: [null, Validators.required],
            certifier: [null, Validators.required],
            file: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            hasAdventureTourismModality: false,
            adventureTourismModalities: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.hasAdventureTourismModalityField.valueChanges.subscribe((value) => {
            this.adventureTourismModalitiesField.setValue(this.items);

            this.dataOut.emit(this.form.value);
        });
    }

    async loadCatalogues() {
        this.classModalities = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities);
        this.airModalities = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_air);
        this.landModalities = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_land);
        this.waterModalities = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_water);
        this.availableModalities = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_name);
        this.certifiers = await this.catalogueService.findByType(CatalogueTypeEnum.adventure_tourism_modalities_name); //review cambiar por el catalogo correspondiente
        console.log(this.availableModalities);
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
        if (this.certifierField.invalid) errors.push('Organismos Certificadores');
        if (this.fileField.invalid) errors.push('Certificación de habilidad o el certificado de aprobación');

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

    onSelect({ item, index }: { item: any; index: number }) {
        if (!item) {
            this.customMessageService.showError({ summary: 'El registro no existe', detail: 'Vuelva a intentar' });
            return;
        }

        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
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
            certifier: this.certifierField.value,
            type: this.typeField.value,
            file: this.fileField.value
        });

        this.adventureTourismModalitiesField.setValue(this.items);

        this.dataOut.emit(this.form.value);

        this.closeModal();
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
                this.items = this.items.filter((item) => item.type?.id !== modality?.type?.id);

                this.adventureTourismModalitiesField.setValue(this.items);

                this.dataOut.emit(this.form.value);
            },
            key: 'confirmdialog'
        });
    }

    closeModal() {
        this.isVisibleModal = false;
        this.modalityForm.reset();
    }

    onFileSelect(modality: CatalogueInterface, event: any) {
        let file = {
            file: event.files[0],
            modality
        };

        this.fileField.patchValue(event.files[0]);
        console.log(this.fileField.value);

        this.responses.set(modality.id!, file);
    }

    // Getter Modality Form
    get classNameField(): AbstractControl {
        return this.modalityForm.get('className')!;
    }

    get typeField(): AbstractControl {
        return this.modalityForm.get('type')!;
    }

    get certifierField(): AbstractControl {
        return this.modalityForm.controls['certifier'];
    }

    get fileField(): AbstractControl {
        return this.modalityForm.controls['file'];
    }
    // Getters Form
    get hasAdventureTourismModalityField(): AbstractControl {
        return this.form.controls['hasAdventureTourismModality'];
    }

    get adventureTourismModalitiesField(): AbstractControl {
        return this.form.controls['adventureTourismModalities'];
    }
}
