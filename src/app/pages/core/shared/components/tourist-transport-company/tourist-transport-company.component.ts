import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fluid } from 'primeng/fluid';
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
import { InputText } from 'primeng/inputtext';
import { CatalogueInterface, ColInterface } from '@utils/interfaces';
import { deleteButtonAction } from '@utils/components/button-action/consts';
import { CustomMessageService } from '@utils/services';
import { TouristTransportCompanyInterface } from '../../interfaces/tourist-transport-company.interface';
import { SelectModule } from 'primeng/select';
import { CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';

@Component({
    selector: 'app-tourist-transport-company',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, Fluid, LabelDirective, ButtonModule, TooltipModule, Message, ErrorMessageDirective, ToastModule, ConfirmDialogModule, ListBasicComponent, DialogModule, InputText, SelectModule, ToggleSwitchComponent],
    templateUrl: './tourist-transport-company.component.html',
    styleUrls: ['./tourist-transport-company.component.scss']
})
export class TouristTransportCompanyComponent implements OnInit {
    @Output() dataOut = new EventEmitter<Record<string, any>>();

    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly customMessageService = inject(CustomMessageService);

    protected readonly PrimeIcons = PrimeIcons;
    protected form!: FormGroup;
    protected transportForm!: FormGroup;
    private readonly catalogueService = inject(CatalogueService);

    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: TouristTransportCompanyInterface[] = [];
    protected buttonActions: MenuItem[] = [];
    protected types: CatalogueInterface[] = [];
    protected rucTypes: CatalogueInterface[] = [];

    ngOnInit() {
        this.buildForm();
        this.buildColumns();
        this.loadCatalogues();
    }

    buildForm() {
        this.transportForm = this.formBuilder.group({
            id: [null],
            ruc: [null, Validators.required],
            legalName: [null, Validators.required],
            rucType: [null, Validators.required],
            authorizationNumber: [null, Validators.required],
            type: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            hasTouristTransportCompany: false,
            touristTransportCompanies: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form.value);

        this.hasTouristTransportCompanyField.valueChanges.subscribe((value) => {
            this.touristTransportCompaniesField.setValue(this.items);

            this.dataOut.emit(this.form.value);
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
            { header: 'Tipo Contribuyente', field: 'rucType', type: 'object' },
            { header: 'Tipo', field: 'type', type: 'object' },
            { header: 'Autorizacion', field: 'authorizationNumber' }
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
        if (this.rucTypeField.invalid) errors.push('Tipo Contribuyente');
        if (this.authorizationNumberField.invalid) errors.push('Autorizacion');
        if (this.typeField.invalid) errors.push('Tipo');

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

        this.items.push({
            ruc: this.rucField.value,
            rucType: this.rucTypeField.value,
            legalName: this.legalNameField.value,
            authorizationNumber: this.authorizationNumberField.value,
            type: this.typeField.value
        });

        this.touristTransportCompaniesField.setValue(this.items);

        this.dataOut.emit(this.form.value);

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

                this.dataOut.emit(this.form.value);
            },
            key: 'confirmdialog'
        });
    }

    async loadCatalogues() {
        this.types = await this.catalogueService.findByType(CatalogueTypeEnum.tourist_transport_companies_type);

        this.rucTypes = await this.catalogueService.findByType(CatalogueTypeEnum.ruc_types);
    }

    closeModal() {
        this.isVisibleModal = false;
        this.transportForm.reset();
    }

    get rucField(): AbstractControl {
        return this.transportForm.get('ruc')!;
    }

    get rucTypeField(): AbstractControl {
        return this.transportForm.get('rucType')!;
    }

    get authorizationNumberField(): AbstractControl {
        return this.transportForm.get('authorizationNumber')!;
    }

    get legalNameField(): AbstractControl {
        return this.transportForm.get('legalName')!;
    }

    get typeField(): AbstractControl {
        return this.transportForm.get('type')!;
    }

    get hasTouristTransportCompanyField(): AbstractControl {
        return this.form.controls['hasTouristTransportCompany'];
    }

    get touristTransportCompaniesField(): AbstractControl {
        return this.form.controls['touristTransportCompanies'];
    }
}
