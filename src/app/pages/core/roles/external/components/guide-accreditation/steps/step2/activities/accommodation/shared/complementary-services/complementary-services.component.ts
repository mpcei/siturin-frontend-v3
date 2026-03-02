import { ComplementaryServiceInterface } from '@/pages/core/interfaces/complementary-service.interface';
import { deleteButtonAction } from '@/utils/components/button-action/consts';
import { ListBasicComponent } from '@/utils/components/list-basic/list-basic.component';
import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { LabelDirective } from '@/utils/directives/label.directive';
import { CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueInterface, ColInterface } from '@/utils/interfaces';
import { CustomMessageService } from '@/utils/services';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { Component, EventEmitter, inject, Input, model, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Fluid } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
    selector: 'app-complementary-services',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, InputNumberModule, ToggleSwitch, TableModule, Button, Dialog, ListBasicComponent, Select],
    templateUrl: './complementary-services.component.html',
    styleUrl: './complementary-services.component.scss'
})
export class ComplementaryServicesComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private confirmationService = inject(ConfirmationService);
    private readonly catalogueService = inject(CatalogueService);

    protected readonly PrimeIcons = PrimeIcons;
    protected complementaryServiceForm!: FormGroup;
    protected form!: FormGroup;

    protected buttonActions: MenuItem[] = [];
    protected isVisibleModal = false;
    protected models: CatalogueInterface[] = [];
    protected cols: ColInterface[] = [];
    protected items: ComplementaryServiceInterface[] = [];
    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.buildColumns();
        this.loadData();
        this.loadCatalogues();
    }

    loadData() {}

    buildForm() {
        this.complementaryServiceForm = this.formBuilder.group({
            id: [null],
            model: [null, [Validators.required]],
            capacity: [null, [Validators.required]]
        });

        this.form = this.formBuilder.group({
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
                    if (item?.model?.id) this.delete(item.model.id);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'Clasificacion', field: 'model', type: 'object' },
            { header: 'Capacidad en numero de personas', field: 'capacity' }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.hasComplementaryServicesField.value && this.items.length === 0) errors.push('Servicios Complementarios');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    validateForm() {
        const errors: string[] = [];

        if (this.modelField.invalid) errors.push('Clasificación');
        if (this.capacityField.invalid) errors.push('Capacidad');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    async loadCatalogues() {
        this.models = await this.catalogueService.findByType(CatalogueTypeEnum.complementary_services_model);
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

    closeModal() {
        this.isVisibleModal = false;
        this.idField.setValue(null);
        this.capacityField.setValue(null);
        this.modelField.setValue(null);
    }

    onSubmit() {
        if (this.validateForm()) {
            this.createTouristGuide();
        }
    }

    createTouristGuide() {
        this.items.push(this.complementaryServiceForm.value);

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
                this.items = this.items.filter((item) => item.model?.id !== modelId);

                this.complementaryServicesField.setValue(this.items);

                this.dataOut.emit(this.form);
            },
            key: 'confirmdialog'
        });
    }

    findTouristGuide(modelId: string) {
        const index = this.items.findIndex((item) => item.model?.id === modelId);
        this.complementaryServiceForm.patchValue(this.items[index]);
    }

    get idField(): AbstractControl {
        return this.complementaryServiceForm.controls['id'];
    }

    get modelField(): AbstractControl {
        return this.complementaryServiceForm.controls['model'];
    }

    get capacityField(): AbstractControl {
        return this.complementaryServiceForm.controls['capacity'];
    }

    get hasComplementaryServicesField(): AbstractControl {
        return this.form.controls['hasComplementaryServices'];
    }

    get complementaryServicesField(): AbstractControl {
        return this.form.controls['complementaryServices'];
    }
}
