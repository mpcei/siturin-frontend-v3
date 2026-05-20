import { Component, inject, input, OnInit, output, OutputEmitterRef, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
import { CustomMessageService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';
import { FileUpload } from 'primeng/fileupload';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';
import { CatalogueGuideClassificationsCodeEnum, CatalogueGuideModalitiesCodeEnum } from '@/pages/core/shared/components/regulation-simulator/enum';
import { VehicleComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/vehicle/vehicle.component';

export interface AdventureTourismModalityInterface {
    id?: string;
    certifier?: CatalogueInterface;
    modality?: CatalogueInterface;
    file?: any;
}

@Component({
    selector: 'app-adventure-tourism-modality',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
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
        ToggleSwitchComponent,
        FileUpload,
        ButtonActionComponent,
        VehicleComponent
    ],
    templateUrl: './adventure-tourism-modality.component.html'
})
export class AdventureTourismModalityComponent implements OnInit {
    public dataOut: OutputEmitterRef<Record<string, any>> = output<Record<string, any>>();
    public classification = input.required<ClassificationInterface>();

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected modalityForm!: FormGroup;

    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: AdventureTourismModalityInterface[] = [];
    protected buttonActions: MenuItem[] = [];
    protected isButtonActionsEnabled: boolean = false;

    protected availableModalities: CatalogueInterface[] = [];
    protected certifiers: CatalogueInterface[] = [];
    protected requirements: CatalogueInterface[] = [];
    protected responses: Map<string, any> = new Map<string, any>();
    protected hasVehicle = signal<boolean>(false);

    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.buildColumns();
        await this.loadCatalogues();
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
            { header: 'Modalidad', field: 'modality', type: 'object' },
            { header: 'Organismos Certificadores', field: 'certifier', type: 'object' },
            { header: 'Certificación de habilidad o el certificado de aprobación', field: 'file', type: 'object' }
        ];
    }

    buildForm() {
        this.modalityForm = this.formBuilder.group({
            id: [null],
            modality: [null, Validators.required],
            certifier: [null, Validators.required],
            file: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            requirement: [null, Validators.required],
            vehicle: [null],
            hasAdventureTourismModality: [null, Validators.requiredTrue],
            adventureTourismModalities: []
        });

        if (this.classification().code === CatalogueGuideClassificationsCodeEnum.guide_local) {
            this.hasAdventureTourismModalityField.clearValidators();
            this.hasAdventureTourismModalityField.updateValueAndValidity();
        }

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.hasAdventureTourismModalityField.valueChanges.subscribe((_) => {
            this.updateFormAndEmit();
        });

        this.modalityField.valueChanges.subscribe(async (value) => {
            if (value) this.certifiers = await this.catalogueService.findByModel(value.id);
        });
    }

    checkVehicles(): void {
        const hasVehicle =
            this.items?.some(({ modality }) => {
                return [CatalogueGuideModalitiesCodeEnum.alm, CatalogueGuideModalitiesCodeEnum.mem].includes(modality?.code as CatalogueGuideModalitiesCodeEnum);
            }) ?? false;

        this.hasVehicle.set(hasVehicle);
    }

    async loadCatalogues() {
        const [requirements] = await Promise.all([ this.catalogueService.findByType(CatalogueTypeEnum.requirement_item)]);

        this.availableModalities = await this.catalogueService.findByModel(this.classification().id!);

        this.requirements = requirements;

        this.requirementField.patchValue(this.requirements.find((x) => x.code === 'modality_adventure'));
    }

    onSubmit() {
        if (this.validateModalityForm()) {
            this.createAdventureTourismModality();
        }
    }

    validateModalityForm() {
        const errors: string[] = [];

        if (this.modalityField.invalid) errors.push('Modalidad');
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

        if (this.hasAdventureTourismModalityField.value && this.items.length === 0) errors.push('Si marcó que Sí en Modalidades de Aventura debe agregar por lo menos una modalidad');

        if (!this.hasAdventureTourismModalityField.value && this.classification().code !== CatalogueGuideClassificationsCodeEnum.guide_local && this.items.length === 0) errors.push('Modalidades de Aventura');

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
        const modality = this.modalityField.value;

        if (this.items.some((i) => i.modality?.code === modality?.code)) {
            this.customMessageService.showError({
                summary: 'Aviso',
                detail: 'La modalidad ya existe'
            });
            return;
        }

        this.items = [
            ...this.items,
            {
                certifier: this.certifierField.value,
                modality,
                file: this.fileField.value
            }
        ];

        this.checkVehicles();
        this.updateFormAndEmit();

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
                this.items = this.items.filter((item) => item.modality?.id !== modality?.modality?.id);

                this.checkVehicles();
                this.updateFormAndEmit();
            },
            key: 'confirmdialog'
        });
    }

    closeModal() {
        this.isVisibleModal = false;
        this.modalityForm.reset();
    }

    onFileSelect(modality: CatalogueInterface, event: any) {
        const file = event.files?.[0] as File;

        if (!file) return;

        this.fileField.patchValue(file);

        this.responses.set(modality.code!, {
            file,
            modality
        });
    }

    saveVehicles(data: any) {
        console.log(data);
        this.vehicleField.patchValue(data);
        this.updateFormAndEmit();
    }

    private updateFormAndEmit() {
        this.adventureTourismModalitiesField.setValue(this.items);
        this.dataOut.emit(this.form.getRawValue());
    }

    // Getter Modality Form
    get modalityField(): AbstractControl {
        return this.modalityForm.controls['modality'];
    }

    get certifierField(): AbstractControl {
        return this.modalityForm.controls['certifier'];
    }

    get fileField(): AbstractControl {
        return this.modalityForm.controls['file'];
    }

    // Getters Form
    get requirementField(): AbstractControl {
        return this.form.controls['requirement'];
    }

    get vehicleField(): AbstractControl {
        return this.form.controls['vehicle'];
    }

    get hasAdventureTourismModalityField(): AbstractControl {
        return this.form.controls['hasAdventureTourismModality'];
    }

    get adventureTourismModalitiesField(): AbstractControl {
        return this.form.controls['adventureTourismModalities'];
    }

    protected readonly CatalogueGuideClassificationsCodeEnum = CatalogueGuideClassificationsCodeEnum;
}
