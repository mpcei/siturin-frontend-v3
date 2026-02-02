import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { TouristGuideInterface } from '@modules/core/interfaces';
import { ListBasicComponent } from '@utils/components/list-basic/list-basic.component';

@Component({
    selector: 'app-tourist-guide',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, ToggleSwitch, TableModule, Button, Dialog, InputText, ListBasicComponent],
    templateUrl: './tourist-guide.component.html',
    styleUrl: './tourist-guide.component.scss'
})
export class TouristGuideComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private confirmationService = inject(ConfirmationService);
    protected readonly PrimeIcons = PrimeIcons;

    protected form!: FormGroup;
    protected touristGuideForm!: FormGroup;
    protected buttonActions: MenuItem[] = [];

    protected isVisibleModal = false;

    protected cols: ColInterface[] = [];
    protected items: TouristGuideInterface[] = [];

    constructor() {

    }

    async ngOnInit() {
        this.buildForm();
        this.buildColumns();
        this.loadData();
    }

    loadData() {}

    buildForm() {
        this.touristGuideForm = this.formBuilder.group({
            id: [null],
            identification: [null, [Validators.required]],
            name: [null, [Validators.required]],
            isGuide: [false, [Validators.required]],
            touristLicenses: [[]]
        });

        this.form = this.formBuilder.group({
            hasTouristGuide: false,
            touristGuides: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form);

        this.hasTouristGuideField.valueChanges.subscribe((value) => {
            this.touristGuidesField.setValue(this.items);

            this.dataOut.emit(this.form);
        });
    }

    buildButtonActions(item: TouristGuideInterface) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item?.identification) this.delete(item.identification);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'Número de cédula', field: 'identification' },
            { header: 'Nombre', field: 'name' }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.hasTouristGuideField.value && this.items.length === 0) errors.push('Guías de Turismo');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    validateForm() {
        const errors: string[] = [];

        if (this.identificationField.invalid) errors.push('Número de cédula');
        if (this.nameField.invalid) errors.push('Nombres');

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

    edit(identification: string) {
        this.idField.enable();
        this.findTouristGuide(identification);
        this.isVisibleModal = true;
    }

    delete(identification: string) {
        this.isVisibleModal = false;

        if (identification) this.deleteTouristGuide(identification);
    }

    view() {
        this.isVisibleModal = true;
    }

    closeModal() {
        this.isVisibleModal = false;
        this.identificationField.reset();
        this.nameField.reset();
        this.isGuideField.reset();
    }

    onSubmit() {
        this.isGuideField.setValue(true);

        if (this.validateForm()) {
            this.createTouristGuide();
        }
    }

    createTouristGuide() {
        this.isGuideField.setValue(true);

        this.items.push(this.touristGuideForm.value);

        this.closeModal();

        this.touristGuidesField.setValue(this.items);

        this.dataOut.emit(this.form);
    }

    deleteTouristGuide(identification: string) {
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
                this.items = this.items.filter(item => item.identification !== identification);

                this.touristGuidesField.setValue(this.items);

                this.dataOut.emit(this.form);
            },
            key: 'confirmdialog'
        });
    }

    findTouristGuide(identification: string) {
        const index = this.items.findIndex((item) => item.identification === identification);
        this.form.patchValue(this.items[index]);
    }

    get idField(): AbstractControl {
        return this.touristGuideForm.controls['id'];
    }

    get identificationField(): AbstractControl {
        return this.touristGuideForm.controls['identification'];
    }

    get nameField(): AbstractControl {
        return this.touristGuideForm.controls['name'];
    }

    get isGuideField(): AbstractControl {
        return this.touristGuideForm.controls['isGuide'];
    }

    get touristLicensesField(): FormArray {
        return this.touristGuideForm.controls['touristLicenses'] as FormArray;
    }

    get hasTouristGuideField(): AbstractControl {
        return this.form.controls['hasTouristGuide'];
    }

    get touristGuidesField(): AbstractControl {
        return this.form.controls['touristGuides'];
    }
}
