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
import { InputMask } from 'primeng/inputmask';
import { getYear } from 'date-fns';

export interface VehicleInterface {
    id?: string;
    plate?: string;
    type?: CatalogueInterface;
    year?: number;
    vehicleRegistrationFile?: any;
    documentVehicleInspectionFile?: any;
    accidentPolicyFile?: any;
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
        InputMask
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
    protected items: VehicleInterface[] = [];
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
                    if (item) this.deleteVehicle(item);
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
        const minYear = getYear(new Date()) - 15;
        const maxYear = getYear(new Date());

        this.vehicleForm = this.formBuilder.group({
            id: [null],
            plate: [null, Validators.required],
            type: [null, Validators.required],
            year: [null, [Validators.required, Validators.min(minYear), Validators.max(maxYear)]],
            vehicleRegistrationFile: [null, Validators.required],
            documentVehicleInspectionFile: [null, Validators.required],
            accidentPolicyFile: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            requirement: [null, Validators.required],
            hasVehicle: false,
            driverLicense: [null, Validators.required],
            driverLicenseType: [null, Validators.required],
            driverLicenseFile: [null, Validators.required],
            vehicles: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.hasVehicleField.valueChanges.subscribe((_) => {
            this.updateFormAndEmit();
        });

        // this.plateField.valueChanges.subscribe((value) => {
        //     if (value) {
        //         this.plateField.setValue(value.toUpperCase(), {
        //             emitEvent: false
        //         });
        //     }
        // });
    }

    async loadCatalogues() {
        const [requirements, types, driverLicenses] = await Promise.all([
            this.catalogueService.findByType(CatalogueTypeEnum.requirement_item),
            this.catalogueService.findByType(CatalogueTypeEnum.guide_vehicles_type),
            this.catalogueService.findByType(CatalogueTypeEnum.guide_vehicles_type) //review cambiar por el tipo que es
        ]);

        this.requirements = requirements;
        this.types = types;
        this.driverLicenses = driverLicenses;

        this.requirementField.patchValue(this.requirements.find((x) => x.code === 'selection_type_mountain'));
        this.driverLicenseTypeField.patchValue(this.requirements.find((x) => x.code === 'driver_license'));
    }

    onSubmit() {
        if (this.validateVehicleForm()) {
            this.createVehicle();
        }
    }

    validateVehicleForm() {
        const errors: string[] = [];

        if (this.plateField.invalid) errors.push('Placa');
        if (this.typeField.invalid) errors.push('Tipo de vehículo');
        if (this.yearField.invalid) errors.push('Año del vehículo');
        if (this.vehicleRegistrationFileField.invalid) errors.push('Matrícula vigente del vehículo');
        if (this.documentVehicleInspectionFileField.invalid) errors.push('Distintivo o documento de aprobación de la revisión técnica vehicular anual');
        if (this.accidentPolicyFileField.invalid) errors.push('Póliza de seguros de accidentes vigente ');

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

    createVehicle() {
        const plate = this.plateField.value;

        if (this.items.some((i) => i.plate === plate)) {
            this.customMessageService.showError({
                summary: 'Aviso',
                detail: 'El vehículo ya existe'
            });
            return;
        }

        this.items = [
            ...this.items,
            {
                plate,
                type: this.typeField.value,
                year: this.yearField.value,
                vehicleRegistrationFile: this.vehicleRegistrationFileField.value,
                documentVehicleInspectionFile: this.documentVehicleInspectionFileField.value,
                accidentPolicyFile: this.accidentPolicyFileField.value
            }
        ];

        this.updateFormAndEmit();

        this.closeModal();
    }

    deleteVehicle(plate: string) {
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

        switch (code) {
            case 'vehicleRegistrationFile':
                this.vehicleRegistrationFileField.patchValue(file);
                break;
            case 'documentVehicleInspectionFile':
                this.documentVehicleInspectionFileField.patchValue(file);
                break;
            case 'accidentPolicyFile':
                this.accidentPolicyFileField.patchValue(file);
                break;
            case 'driverLicenseFile':
                this.driverLicenseFileField.patchValue(file);
                break;
        }

        this.responses.set(code, {
            file,
            code
        });
    }

    private updateFormAndEmit() {
        this.vehiclesField.setValue(this.items);
        this.dataOut.emit(this.form.getRawValue());
    }

    // Getter Form
    get plateField(): AbstractControl {
        return this.vehicleForm.controls['plate'];
    }

    get typeField(): AbstractControl {
        return this.vehicleForm.controls['type'];
    }

    get yearField(): AbstractControl {
        return this.vehicleForm.controls['year'];
    }

    get vehicleRegistrationFileField(): AbstractControl {
        return this.vehicleForm.controls['vehicleRegistrationFile'];
    }

    get documentVehicleInspectionFileField(): AbstractControl {
        return this.vehicleForm.controls['documentVehicleInspectionFile'];
    }

    get accidentPolicyFileField(): AbstractControl {
        return this.vehicleForm.controls['accidentPolicyFile'];
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

    get driverLicenseTypeField(): AbstractControl {
        return this.form.controls['driverLicenseType'];
    }

    get driverLicenseFileField(): AbstractControl {
        return this.form.controls['driverLicenseFile'];
    }

    get vehiclesField(): AbstractControl {
        return this.form.controls['vehicles'];
    }
}
