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
import { SalesRepresentativeInterface } from '@/pages/core/shared/interfaces/sales-representative.interface';

@Component({
    selector: 'app-sales-representative',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, Fluid, LabelDirective, ButtonModule, ToggleSwitch, TooltipModule, Message, ErrorMessageDirective, ToastModule, ConfirmDialogModule, ListBasicComponent, DialogModule, InputText],
    templateUrl: './sales-representative.component.html',
    styleUrls: ['./sales-representative.component.scss']
})
export class SalesRepresentativeComponent implements OnInit {
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly customMessageService = inject(CustomMessageService);

    protected readonly PrimeIcons = PrimeIcons;
    protected form!: FormGroup;
    protected salesRepresentativeForm!: FormGroup;

    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: SalesRepresentativeInterface[] = [];
    protected buttonActions: MenuItem[] = [];

    async ngOnInit() {
        this.buildForm();
        this.buildColumns();
    }

    buildForm() {
        this.salesRepresentativeForm = this.formBuilder.group({
            id: [null],
            ruc: [null, Validators.required],
            legalName: [null, Validators.required],
            hasProfessionalDegree: [false, [Validators.required]],
            hasContract: [false, [Validators.required]],
            hasWorkExperience: [false, [Validators.required]]
        });

        this.form = this.formBuilder.group({
            hasSalesRepresentative: false,
            salesRepresentatives: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form);

        this.hasSalesRepresentativeField.valueChanges.subscribe((value) => {
            this.salesRepresentativesField.setValue(this.items);

            this.dataOut.emit(this.form);
        });
    }

    buildButtonActions(item: SalesRepresentativeInterface) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item) this.deleteSalesRepresentative(item);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'RUC', field: 'ruc' },
            { header: 'Razón Social', field: 'legalName' },
            { header: 'Título Profesional', field: 'hasProfessionalDegree' },
            { header: 'Contrato Suscrito', field: 'hasContract' },
            { header: 'Experiencia Probada', field: 'hasWorkExperience' }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.hasSalesRepresentativeField.value && this.items.length === 0) errors.push('Representante de Ventas');

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

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    onSubmit() {
        if (this.validateForm()) {
            this.createSalesRepresentative();
        }
    }

    createSalesRepresentative() {
        const exists = this.items.some((item) => item.ruc === this.rucField.value);

        if (exists) {
            this.customMessageService.showError({
                summary: 'Aviso',
                detail: 'El representante ya fue agregado'
            });
            return;
        }

        this.items.push({
            ruc: this.rucField.value,
            legalName: this.legalNameField.value,
            hasProfessionalDegree: this.hasProfessionalDegreeField.value,
            hasContract: this.hasContractField.value,
            hasWorkExperience: this.hasWorkExperienceField.value
        });

        this.salesRepresentativesField.setValue(this.items);

        this.dataOut.emit(this.form);

        this.closeModal();
    }

    deleteSalesRepresentative(representative: SalesRepresentativeInterface) {
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
                this.items = this.items.filter((item) => item.ruc !== representative.ruc);

                this.salesRepresentativesField.setValue(this.items);

                this.dataOut.emit(this.form);
            },
            key: 'confirmdialog'
        });
    }

    closeModal(): void {
        this.isVisibleModal = false;
        this.salesRepresentativeForm.reset();
    }

    get rucField(): AbstractControl {
        return this.salesRepresentativeForm.get('ruc')!;
    }

    get legalNameField(): AbstractControl {
        return this.salesRepresentativeForm.get('legalName')!;
    }

    get hasProfessionalDegreeField(): AbstractControl {
        return this.salesRepresentativeForm.get('hasProfessionalDegree')!;
    }

    get hasContractField(): AbstractControl {
        return this.salesRepresentativeForm.get('hasContract')!;
    }

    get hasWorkExperienceField(): AbstractControl {
        return this.salesRepresentativeForm.get('hasWorkExperience')!;
    }

    get hasSalesRepresentativeField(): AbstractControl {
        return this.form.controls['hasSalesRepresentative'];
    }

    get salesRepresentativesField(): AbstractControl {
        return this.form.controls['salesRepresentatives'];
    }
}
