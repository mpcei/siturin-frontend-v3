import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ColInterface } from '@utils/interfaces';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { deleteButtonAction } from '@utils/components/button-action/consts';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ListBasicComponent } from '@utils/components/list-basic/list-basic.component';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';

@Component({
    selector: 'app-maritime',
    imports: [Fluid, ReactiveFormsModule, DatePicker, LabelDirective, Message, ErrorMessageDirective, ToggleSwitch, TableModule, Button, Dialog, InputText, ListBasicComponent, InputNumber],
    templateUrl: './maritime.component.html',
    styleUrls: ['./maritime.component.scss']
})
export class MaritimeComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private confirmationService = inject(ConfirmationService);
    protected readonly PrimeIcons = PrimeIcons;

    protected form!: FormGroup;
    protected maritimeForm!: FormGroup;
    protected buttonActions: MenuItem[] = [];

    protected isVisibleModal = false;

    protected cols: ColInterface[] = [];
    protected items: any[] = [];

    constructor() {}

    ngOnInit() {
        this.buildForm();
        this.buildColumns();
        this.loadData();
    }

    loadData() {}

    buildForm() {
        this.maritimeForm = this.formBuilder.group({
            id: [null],
            totalUnits: [null, [Validators.required]],
            totalSeats: [null, [Validators.required]],
            certifiedCode: [null, [Validators.required]],
            certifiedIssueAt: [null, [Validators.required]],
            certifiedExpirationAt: [null, [Validators.required]]
        });

        this.form = this.formBuilder.group({
            hasMaritimeTransport: false,
            maritimeItems: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form);

        this.hasMaritimeTransportField.valueChanges.subscribe((value) => {
            this.maritimeItemsField.setValue(this.items);
            this.dataOut.emit(this.form);
        });
    }

    buildButtonActions(item: any) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item?.certifiedCode) this.delete(item.certifiedCode);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'Número de unidades de transporte', field: 'totalUnits' },
            { header: 'Total, número de puesto', field: 'totalSeats' },
            { header: 'Número o Código de la Matrícula de Armador', field: 'certifiedCode' },
            { header: 'Fecha de emisión de la Matrícula de Armador', field: 'certifiedIssueAt' },
            { header: 'Fecha de Caducidad de la Matrícula de Armador', field: 'certifiedExpirationAt' }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];
        if (this.hasMaritimeTransportField.value && this.items.length === 0) errors.push('Transporte Marítimo');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    validateForm() {
        const errors: string[] = [];
        if (this.totalUnitsField.invalid) errors.push('Número de unidades de transporte');
        if (this.totalSeatsField.invalid) errors.push('Total, número de puesto');
        if (this.certifiedCodeField.invalid) errors.push('Número o Código de la Matrícula de Armador');
        if (this.certifiedIssueAtField.invalid) errors.push('Fecha de emisión de la Matrícula de Armador');
        if (this.certifiedExpirationAtField.invalid) errors.push('Fecha de Caducidad de la Matrícula de Armador');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    create() {
        this.idField.disable();
        this.isVisibleModal = true;
    }

    edit(id: string) {
        this.idField.enable();
        this.findMaritimeItem(id);
        this.isVisibleModal = true;
    }

    delete(certifiedCode: string) {
        this.isVisibleModal = false;

        if (certifiedCode) this.deleteMaritimeItem(certifiedCode);
    }

    view() {
        this.isVisibleModal = true;
    }

    closeModal() {
        this.isVisibleModal = false;
        this.idField.reset();
        this.totalUnitsField.reset();
        this.totalSeatsField.reset();
        this.certifiedCodeField.reset();
        this.certifiedIssueAtField.reset();
        this.certifiedExpirationAtField.reset();
    }

    onSubmit() {
        if (this.validateForm()) {
            this.createMaritimeItem();
        }
    }

    createMaritimeItem() {
        this.items.push(this.maritimeForm.value);

        this.closeModal();

        this.maritimeItemsField.setValue(this.items);

        this.dataOut.emit(this.form);
    }

    deleteMaritimeItem(certifiedCode: string) {
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
                this.items = this.items.filter((item) => item.certifiedCode !== certifiedCode);

                this.maritimeItemsField.setValue(this.items);

                this.dataOut.emit(this.form);
            },
            key: 'confirmdialog'
        });
    }

    findMaritimeItem(id: string) {
        const index = this.items.findIndex((item) => item.id === id);
        if (index > -1) {
            this.maritimeForm.patchValue(this.items[index]);
        }
    }

    get idField(): AbstractControl {
        return this.maritimeForm.controls['id'];
    }

    get totalUnitsField(): AbstractControl {
        return this.maritimeForm.controls['totalUnits'];
    }

    get totalSeatsField(): AbstractControl {
        return this.maritimeForm.controls['totalSeats'];
    }

    get certifiedCodeField(): AbstractControl {
        return this.maritimeForm.controls['certifiedCode'];
    }

    get certifiedIssueAtField(): AbstractControl {
        return this.maritimeForm.controls['certifiedIssueAt'];
    }

    get certifiedExpirationAtField(): AbstractControl {
        return this.maritimeForm.controls['certifiedExpirationAt'];
    }

    get hasMaritimeTransportField(): AbstractControl {
        return this.form.controls['hasMaritimeTransport'];
    }

    get maritimeItemsField(): AbstractControl {
        return this.form.controls['maritimeItems'];
    }
}
