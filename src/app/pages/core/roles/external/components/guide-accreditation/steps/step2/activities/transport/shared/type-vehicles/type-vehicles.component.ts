import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CatalogueInterface, ColInterface } from '@utils/interfaces';
import { Message } from 'primeng/message';
import { DatePicker } from 'primeng/datepicker';
import { LabelDirective } from '@/utils/directives/label.directive';
import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { FluidModule } from 'primeng/fluid';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Dialog } from 'primeng/dialog';
import { ListBasicComponent } from '@/utils/components/list-basic/list-basic.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { AdventureTourismModalityInterface } from '@/pages/core/shared/interfaces';
import { deleteButtonAction } from '@utils/components/button-action/consts';

interface LandTransportInterface {
    type: string;
    plate: string;
    registration: string;
    capacity: number;
    registrationAt: Date | null;
    registrationExpirationAt: Date | null;
    certifiedCode: string;
    certifiedIssueAt: Date | null;
    certifiedExpirationAt: Date | null;
}

@Component({
    selector: 'app-type-vehicles',
    templateUrl: './type-vehicles.component.html',
    styleUrls: ['./type-vehicles.component.scss'],
    imports: [
        Message,
        ButtonModule,
        DatePicker,
        ListBasicComponent,
        InputTextModule,
        SelectModule,
        LabelDirective,
        ErrorMessageDirective,
        FluidModule,
        ReactiveFormsModule,
        ToggleButtonModule,
        Dialog,
        ListBasicComponent,
        InputNumberModule,
        ToggleSwitch
    ]
})
export class TypeVehiclesComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private confirmationService = inject(ConfirmationService);
    protected readonly PrimeIcons = PrimeIcons;
    private readonly catalogueService = inject(CatalogueService);

    protected form!: FormGroup;
    protected landTransportTypeForm!: FormGroup;
    protected buttonActions: MenuItem[] = [];

    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: LandTransportInterface[] = [];
    protected types: CatalogueInterface[] = [];

    ngOnInit(): void {
        this.buildForm();
        this.buildColumns();
        this.loadCatalogues();
    }

    buildForm(): void {
        this.landTransportTypeForm = this.formBuilder.group({
            type: ['null', Validators.required],
            plate: [null, [Validators.required, Validators.maxLength(20)]],
            registration: [null, Validators.required],
            capacity: [null, [Validators.required, Validators.min(1)]],
            certifiedCode: [null, Validators.required],
            certifiedIssueAt: [null, Validators.required],
            certifiedExpirationAt: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            hasLandTransports: [false],
            landTransportTypes: [[]]
        });
    }

    buildColumns(): void {
        this.cols = [
            { field: 'type', header: 'Tipo', type: 'object' },
            { field: 'plate', header: 'Placa' },
            { field: 'registration', header: 'Formulario Matrícula' },
            { field: 'capacity', header: 'Capacidad' },
            { field: 'certifiedCode', header: 'Código de Certificación' },
            { field: 'certifiedIssueAt', header: 'Fecha de Emisión' },
            { field: 'certifiedExpirationAt', header: 'Fecha de Expiración' }
        ];
    }

    buildButtonActions(item: LandTransportInterface) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item) this.deleteLandTransport(item);
                }
            }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.typeField.invalid) errors.push('Tipo');
        if (this.plateField.invalid) errors.push('Placa');
        if (this.registrationField.invalid) errors.push('Formulario Matrícula');
        if (this.capacityField.invalid) errors.push('Capacidad');
        if (this.certifiedCodeField.invalid) errors.push('Código de Certificación');
        if (this.certifiedIssueAtField.invalid) errors.push('Fecha de Emisión');
        if (this.certifiedExpirationAtField.invalid) errors.push('Fecha de Expiración');

        if (errors.length > 0) {
            this.landTransportTypeForm.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
        }

        return errors;
    }

    create(): void {
        this.landTransportTypeForm.reset();
        this.isVisibleModal = true;
    }

    closeModal(): void {
        this.isVisibleModal = false;
    }

    onSubmit(): void {
        this.hasLandTransportsField.setValue(true);

        if (this.getFormErrors()) {
            this.createLandTransportType();
        }
    }

    createLandTransportType(): void {
        this.hasLandTransportsField.setValue(true);

        this.items.push(this.landTransportTypeForm.value);

        this.closeModal();

        this.landTransportTypesField.setValue(this.items);

        this.dataOut.emit(this.form);
    }

    editLandTransport(item: LandTransportInterface): void {
        this.landTransportTypeForm.patchValue(item);
        this.isVisibleModal = true;
    }

    deleteLandTransport(item: LandTransportInterface): void {
        this.confirmationService.confirm({
            key: 'confirmdialog',
            message: '¿Está seguro de eliminar?',
            header: 'Eliminar',
            icon: this.PrimeIcons.TRASH,
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.items = this.items.filter((i) => i.certifiedCode !== item.certifiedCode);
                this.landTransportTypesField.setValue(this.items);
                this.dataOut.emit(this.form);
            }
        });
    }

    async loadCatalogues() {
        this.types = await this.catalogueService.findByType(CatalogueTypeEnum.transport_vehicle_types);
    }

    get hasLandTransportsField(): AbstractControl {
        return this.form.controls['hasLandTransports'];
    }

    get landTransportTypesField(): AbstractControl {
        return this.form.controls['landTransportTypes'];
    }

    get typeField(): AbstractControl {
        return this.landTransportTypeForm.controls['type'];
    }

    get plateField(): AbstractControl {
        return this.landTransportTypeForm.controls['plate'];
    }

    get registrationField(): AbstractControl {
        return this.landTransportTypeForm.controls['registration'];
    }

    get capacityField(): AbstractControl {
        return this.landTransportTypeForm.controls['capacity'];
    }

    get certifiedCodeField(): AbstractControl {
        return this.landTransportTypeForm.controls['certifiedCode'];
    }

    get certifiedIssueAtField(): AbstractControl {
        return this.landTransportTypeForm.controls['certifiedIssueAt'];
    }

    get certifiedExpirationAtField(): AbstractControl {
        return this.landTransportTypeForm.controls['certifiedExpirationAt'];
    }
}
