import { deleteButtonAction } from '@/utils/components/button-action/consts';
import { ListBasicComponent } from '@/utils/components/list-basic/list-basic.component';
import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { LabelDirective } from '@/utils/directives/label.directive';
import { CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueInterface, ColInterface } from '@/utils/interfaces';
import { CustomMessageService } from '@/utils/services';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { Component, EventEmitter, inject, Input, model, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationService, PrimeIcons, MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Fluid } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ComplementaryServiceInterface } from '../../../../interfaces/complementary-serives.interface';

@Component({
  selector: 'app-complementary-services',
  standalone: true,
  imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, InputNumberModule, ToggleSwitch, TableModule, Button, Dialog, ListBasicComponent, Select],
  templateUrl: './complementary-services.component.html',
  styleUrl: './complementary-services.component.scss'
})
export class ComplementaryServicesComponent {
  @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private confirmationService = inject(ConfirmationService);
    protected readonly PrimeIcons = PrimeIcons;

    protected form!: FormGroup;
    protected buttonActions: MenuItem[] = [];

    protected isVisibleModal = false;
    protected modelId: CatalogueInterface[] = [];
    protected cols: ColInterface[] = [];
    protected items: ComplementaryServiceInterface[] = [];
    private readonly catalogueService = inject(CatalogueService);
    constructor() {

    }

    async ngOnInit() {
        this.buildForm();
        this.buildColumns();
        this.loadData();
        this.loadCatalogues
    }

    loadData() {}

    buildForm() {
        this.form = this.formBuilder.group({
            id: [null],
            modelId: [null, [Validators.required]],
            capacity: [null, [Validators.required]],
            services: [[]],

            hasComplementaryServices: false,
            complementaryServices: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form);

        this.hasComplementaryServicesField.valueChanges.subscribe((value) => {
            this.complementaryServicesField.setValue(this.items);

            this.dataOut.emit(this.form);
        });
    }

    buildButtonActions(item: ComplementaryServiceInterface) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item?.modelId) this.delete(item.modelId);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'Clasificacion', field: 'modelId' },
            { header: 'Capacidad en numero de personas', field: 'capacity' }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.hasComplementaryServicesField.value && this.items.length === 0) errors.push('Guías de Turismo');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    validateForm() {
        const errors: string[] = [];

        if (this.modelIdField.invalid) errors.push('Número de cédula');
        if (this.capacityField.invalid) errors.push('Nombres');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
  async loadCatalogues() {
    this.modelId = await this.catalogueService.findByType(CatalogueTypeEnum.complementary_services_entity);
}

    create() {
        this.idField.disable();
        this.isVisibleModal = true;
    }

    edit(modelId: string) {
        this.idField.enable();
        this.findTouristGuide(modelId);
        this.isVisibleModal = true;
    }

    delete(modelId: string) {
        this.isVisibleModal = false;

        if (modelId) this.deleteTouristGuide(modelId);
    }

    view() {
        this.isVisibleModal = true;
    }

    closeModal() {
        this.isVisibleModal = false;
        this.modelIdField.reset();
        this.capacityField.reset();
    }

    onSubmit() {


        if (this.validateForm()) {
            this.createTouristGuide();
        }
    }

    createTouristGuide() {


        this.items.push(this.form.value);

        this.closeModal();

        this.complementaryServicesField.setValue(this.items);

        this.dataOut.emit(this.form);
    }

    deleteTouristGuide(modelId: string) {
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
                this.items = this.items.filter(item => item.modelId !== modelId);

                this.complementaryServicesField.setValue(this.items);

                this.dataOut.emit(this.form);
            },
            key: 'confirmdialog'
        });
    }

    findTouristGuide(modelId: string) {
        const index = this.items.findIndex((item) => item.modelId === modelId);
        this.form.patchValue(this.items[index]);
    }

    get idField(): AbstractControl {
        return this.form.controls['id'];
    }

    get modelIdField(): AbstractControl {
        return this.form.controls['modelId'];
    }

    get capacityField(): AbstractControl {
        return this.form.controls['capacity'];
    }

    get servicesField(): FormArray {
        return this.form.controls['services'] as FormArray;
    }

    get hasComplementaryServicesField(): AbstractControl {
        return this.form.controls['hasComplementaryServices'];
    }

    get complementaryServicesField(): AbstractControl {
        return this.form.controls['complementaryServices'];
    }
}
