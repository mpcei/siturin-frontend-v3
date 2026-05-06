import { Component, inject, OnInit, output, OutputEmitterRef } from '@angular/core';
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
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';

export interface AdventureTourismModalityInterface {
    id?: string;
    plate?: string;
    type?: CatalogueInterface;
    year?: number;
    file?: any;
}

@Component({
    selector: 'app-vehicle',
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
        InputNumber,
        InputText
    ],
    templateUrl: './vehicle.component.html'
})
export class VehicleComponent implements OnInit {
    public dataOut: OutputEmitterRef<Record<string, any>> = output<Record<string, any>>();

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected vehicleForm!: FormGroup;

    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: AdventureTourismModalityInterface[] = [];
    protected buttonActions: MenuItem[] = [];
    protected isButtonActionsEnabled: boolean = false;

    protected driverLicenses: CatalogueInterface[] = [];
    protected types: CatalogueInterface[] = [];
    protected requirements: CatalogueInterface[] = [];
    protected responses: Map<string, any> = new Map<string, any>();

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
            { header: 'Placa', field: 'plate' },
            { header: ' Año del vehículo', field: 'year' },
            { header: ' Tipo de vehículo', field: 'type', type: 'object' }
        ];
    }

    buildForm() {
        this.vehicleForm = this.formBuilder.group({
            id: [null],
            plate: [null, Validators.required],
            type: [null, Validators.required],
            year: [null, Validators.required],
            file: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            requirement: [null, Validators.required],
            hasVehicle: false,
            driverLicense: [null, Validators.required],
            vehicles: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.hasVehicleField.valueChanges.subscribe((_) => {
            this.updateFormAndEmit();
        });
    }

    async loadCatalogues() {
        const [requirements, types] = await Promise.all([this.catalogueService.findByType(CatalogueTypeEnum.requirement_item), this.catalogueService.findByType(CatalogueTypeEnum.guide_vehicles_type)]);

        this.requirements = requirements;
        this.types = types;

        this.requirementField.patchValue(this.requirements.find((x) => x.code === 'selection_type_mountain'));
        this.driverLicenseField.patchValue(this.requirements.find((x) => x.code === 'driver_license'));
    }

    onSubmit() {
        if (this.validateModalityForm()) {
            this.createAdventureTourismModality();
        }
    }

    validateModalityForm() {
        const errors: string[] = [];

        if (this.plateField.invalid) errors.push('Placa');
        if (this.typeField.invalid) errors.push('Tipo de vehículo');
        if (this.yearField.invalid) errors.push('Año del vehículo');
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

        if (this.hasVehicleField.value && this.items.length === 0) errors.push('Vehículos');

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
        const plate = this.plateField.value;

        if (this.items.some((i) => i.plate === plate)) {
            this.customMessageService.showError({
                summary: 'Aviso',
                detail: 'La modalidad ya existe'
            });
            return;
        }

        this.items = [
            ...this.items,
            {
                year: this.yearField.value,
                type: this.typeField.value,
                plate,
                file: this.fileField.value
            }
        ];

        this.updateFormAndEmit();

        this.closeModal();
    }

    deleteAdventureTourismModality(plate: string) {
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
                this.items = this.items.filter((item) => item.plate !== plate);

                this.updateFormAndEmit();
            },
            key: 'confirmdialog'
        });
    }

    closeModal() {
        this.isVisibleModal = false;
        this.vehicleForm.reset();
    }

    onFileSelect(code: string, event: any) {
        const file = event.files?.[0] as File;

        if (!file) return;

        this.fileField.patchValue(file);

        this.responses.set(code, {
            file,
            code
        });
    }

    private updateFormAndEmit() {
        this.vehiclesField.setValue(this.items);
        this.dataOut.emit(this.form.getRawValue());
    }

    // Getter Modality Form
    get plateField(): AbstractControl {
        return this.vehicleForm.controls['plate'];
    }

    get typeField(): AbstractControl {
        return this.vehicleForm.controls['type'];
    }

    get yearField(): AbstractControl {
        return this.vehicleForm.controls['year'];
    }

    get fileField(): AbstractControl {
        return this.vehicleForm.controls['file'];
    }

    // Getters Form
    get requirementField(): AbstractControl {
        return this.form.controls['requirement'];
    }

    get hasVehicleField(): AbstractControl {
        return this.form.controls['hasVehicle'];
    }

    get driverLicenseField(): AbstractControl {
        return this.form.controls['driverLicense'];
    }

    get vehiclesField(): AbstractControl {
        return this.form.controls['vehicles'];
    }
}
