import { CatalogueInterface } from '@utils/interfaces/catalogue.interface';
import { deleteButtonAction } from '@/utils/components/button-action/consts';
import { ListBasicComponent } from '@/utils/components/list-basic/list-basic.component';
import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { LabelDirective } from '@/utils/directives/label.directive';
import { CatalogueTypeEnum } from '@/utils/enums/catalogue.enum';
import { ColInterface } from '@/utils/interfaces';
import { CustomMessageService } from '@/utils/services';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
import { RoomInterface } from '@/pages/core/interfaces/room.interface';

@Component({
    selector: 'app-establishment-capabilities',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, Message, LabelDirective, ErrorMessageDirective, ToggleSwitch, TableModule, Select, Button, Dialog, InputNumberModule, ListBasicComponent],
    templateUrl: './establishment-capabilities.component.html',
    styleUrl: './establishment-capabilities.component.scss'
})
export class EstablishmentCapabilitiesComponent {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private confirmationService = inject(ConfirmationService);
    protected readonly PrimeIcons = PrimeIcons;

    protected roomForm!: FormGroup;
    protected form!: FormGroup;
    protected buttonActions: MenuItem[] = [];

    protected isVisibleModal = false;
    protected roomTypes: CatalogueInterface[] = [];
    protected cols: ColInterface[] = [];
    protected items: RoomInterface[] = [];
    private readonly catalogueService = inject(CatalogueService);
    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.buildColumns();
        this.loadData();
        this.loadCatalogues;
    }

    loadData() {}

    buildForm() {
        this.roomForm = this.formBuilder.group({
            id: [null],
            roomType: [null, [Validators.required]],
            totalRooms: [null, Validators.required],
            totalBeds: [null, Validators.required],
            totalPlaces: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            hasRooms: false,
            rooms: [null, [Validators.required]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form);

        this.hasRoomsField.valueChanges.subscribe((value) => {
            this.form.setValue(this.items);

            this.dataOut.emit(this.form);
        });
    }

    buildButtonActions(item: RoomInterface) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item?.roomType?.id) this.delete(item.roomType.id);
                }
            }
        ];
    }

    buildColumns() {
        this.cols = [
            { header: 'Tipo', field: 'roomType' },
            { header: 'Habitaciones', field: 'totalRooms' },
            { header: 'Camas', field: 'totalbeds' },
            { header: 'Plazas', field: 'totalPlaces' }
        ];
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.hasRoomsField.value && this.items.length === 0) errors.push('Capacidades de Establecimiento');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    validateForm() {
        const errors: string[] = [];

        if (this.roomTypeField.invalid) errors.push('tipo dehabitacion');
        if (this.totalRoomsField.invalid) errors.push('habitaciones');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    async loadCatalogues() {
        this.roomTypes = await this.catalogueService.findByType(CatalogueTypeEnum.rooms_room_type);
    }

    create() {
        this.idField.disable();
        this.isVisibleModal = true;
    }

    edit(identification: string) {
        this.idField.enable();
        this.findRoomGuide(identification);
        this.isVisibleModal = true;
    }

    delete(roomTypeId: string) {
        this.isVisibleModal = false;

        if (roomTypeId) this.deleteRoom(roomTypeId);
    }

    view() {
        this.isVisibleModal = true;
    }

    closeModal() {
        this.isVisibleModal = false;
        this.idField.setValue(null);
        this.roomTypeField.setValue(null);
        this.totalRoomsField.setValue(null);
        this.totalBedsField.setValue(null);
        this.totalPlacesField.setValue(null);
    }

    onSubmit() {
        if (this.validateForm()) {
            this.createRoom();
        }
    }

    createRoom() {
        this.items.push(this.roomForm.value);

        this.closeModal();

        this.roomsField.setValue(this.items);

        this.dataOut.emit(this.form);
    }

    deleteRoom(roomTypeId: string) {
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
                this.items = this.items.filter((item) => item.roomType?.id !== roomTypeId);

                this.roomsField.setValue(this.items);

                this.dataOut.emit(this.form);
            },
            key: 'confirmdialog'
        });
    }

    findRoomGuide(roomType: string) {
        const index = this.items.findIndex((item) => item.roomType === roomType);
        this.form.patchValue(this.items[index]);
    }

    get idField(): AbstractControl {
        return this.roomForm.controls['id'];
    }

    get roomTypeField(): AbstractControl {
        return this.roomForm.controls['roomType'];
    }

    get totalRoomsField(): AbstractControl {
        return this.roomForm.controls['totalRooms'];
    }

    get totalBedsField(): AbstractControl {
        return this.roomForm.controls['totalBeds'];
    }

    get totalPlacesField(): AbstractControl {
        return this.roomForm.controls['totalPlaces'];
    }

    get roomsField(): AbstractControl {
        return this.form.controls['rooms'];
    }

    get hasRoomsField(): AbstractControl {
        return this.form.controls['hasRooms'];
    }
}
