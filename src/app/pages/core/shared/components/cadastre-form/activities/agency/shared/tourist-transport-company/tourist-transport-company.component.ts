import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fluid } from 'primeng/fluid';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { Message } from 'primeng/message';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ListBasicComponent } from '@utils/components/list-basic/list-basic.component';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ColInterface } from '@utils/interfaces';
import { deleteButtonAction } from '@utils/components/button-action/consts';
import { CustomMessageService } from '@utils/services';
import { TouristTransportCompanyInterface } from '@/pages/core/shared/interfaces/tourist-transport-company.interface';

@Component({
    selector: 'app-tourist-transport-company',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, Fluid, LabelDirective, ButtonModule, ToggleSwitch, TooltipModule, Message, ErrorMessageDirective, ToastModule, ConfirmDialogModule, ListBasicComponent, DialogModule, InputText],
    templateUrl: './tourist-transport-company.component.html',
    styleUrls: ['./tourist-transport-company.component.scss']
})
export class TouristTransportCompanyComponent implements OnInit {
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly customMessageService = inject(CustomMessageService);

    protected readonly PrimeIcons = PrimeIcons;
    protected form!: FormGroup;
    protected touristTransportCompanyForm!: FormGroup;

    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: TouristTransportCompanyInterface[] = [];
    protected buttonActions: MenuItem[] = [];

    ngOnInit() {
        this.buildForm();
        this.buildColumns();
    }

    buildForm() {
        this.touristTransportCompanyForm = this.formBuilder.group({
            id: [null],
            ruc: [null, Validators.required],
            legalName: [null, Validators.required],
            type: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            hasTouristTransportCompany: false,
            touristTransportCompanies: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form);

        this.hasTouristTransportCompanyField.valueChanges.subscribe((value) => {
            this.touristTransportCompaniesField.setValue(this.items);

            this.dataOut.emit(this.form);
        });
    }

    buildButtonActions(item: TouristTransportCompanyInterface) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item) this.deleteTouristTransportCompany(item);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'RUC', field: 'ruc' },
            { header: 'Razón Social', field: 'legalName' },
            { header: 'Tipo Contribuyente', field: 'type' }
        ];
    }

    getFormErrors() {
        const errors: string[] = [];

        if (this.hasTouristTransportCompanyField.value && this.items.length === 0) errors.push('Compañias de Transporte Turístico');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    validateForm() {
        const errors: string[] = [];

        if (this.rucField.invalid) errors.push('RUC');
        if (this.legalNameField.invalid) errors.push('Razón Social');
        if (this.typeField.invalid) errors.push('Tipo Contribuyente');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    onSubmit() {
        if (this.validateForm()) {
            this.createTouristTransportCompany();
        }
    }

    createTouristTransportCompany() {
        const exists = this.items.some((item) => item.ruc === this.rucField.value);

        if (exists) {
            this.customMessageService.showError({
                summary: 'Aviso',
                detail: 'La compañia ya fue agregada'
            });
            return;
        }

        this.items.push(this.form.value);

        this.touristTransportCompaniesField.setValue(this.items);

        this.dataOut.emit(this.form);

        this.closeModal();
    }

    deleteTouristTransportCompany(company: TouristTransportCompanyInterface) {
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
                this.items = this.items.filter((item) => item.ruc !== company.ruc);

                this.touristTransportCompaniesField.setValue(this.items);

                this.dataOut.emit(this.form);
            },
            key: 'confirmdialog'
        });
    }

    closeModal() {
        this.isVisibleModal = false;
        this.touristTransportCompanyForm.reset();
    }

    get rucField(): AbstractControl {
        return this.touristTransportCompanyForm.get('ruc')!;
    }

    get legalNameField(): AbstractControl {
        return this.touristTransportCompanyForm.get('legalName')!;
    }

    get typeField(): AbstractControl {
        return this.touristTransportCompanyForm.get('type')!;
    }

    get hasTouristTransportCompanyField(): AbstractControl {
        return this.form.controls['hasTouristTransportCompany'];
    }

    get touristTransportCompaniesField(): AbstractControl {
        return this.form.controls['touristTransportCompanies'];
    }
}
