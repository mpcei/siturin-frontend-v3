import { Component, OnInit, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { AssignDpaComponent } from './components/assign-dpa/assign-dpa';
import { InternalHttpService } from '../../services/internal-http.service';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { CustomMessageService } from '@/utils/services';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { ButtonActionComponent } from '@/utils/components/button-action/button-action.component';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-user-list-container',
    imports: [TableModule, Button, AssignDpaComponent, ButtonActionComponent, Tag],
    templateUrl: './user-list-container.html'
})
export class UserListContainerComponent implements OnInit {
    protected items = signal<any[]>([]);
    protected selectedItem: any;
    protected pagination: any = {};
    protected isLoading = signal<boolean>(false);
    protected currentSearch: string = '';

    protected buttonActions: MenuItem[] = [];
    protected isButtonActionsEnabled: boolean = false;

    protected isDpaModalVisible = signal<boolean>(false);
    protected userDpas = signal<any[]>([]);

    protected readonly customMessageService = inject(CustomMessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly service = inject(InternalHttpService);

    FontAwesome = FontAwesome;
    constructor() {}

    ngOnInit() {
        this.loadData();
    }

    loadData(page = 1) {
        this.isLoading.set(true);
        this.service.getInternalUsersList(page, this.currentSearch).subscribe({
            next: (response: any) => {
                this.items.set(response.data);
                this.pagination = response.pagination;
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    onSelect(item: any, index: number) {
        if (!item) {
            this.customMessageService.showError({ summary: 'Error', detail: 'Registro no válido' });
            return;
        }
        this.selectedItem = item;
        this.buttonActions = [];
        this.buildButtonActions(item, index);
        this.isButtonActionsEnabled = true;
    }
    buildButtonActions(item: any, index: number) {
        if (!item.internalUser) {
            this.buttonActions.push({
                label: 'Asignar como Interno',
                icon: 'pi pi-user-plus',
                command: () => this.registerAsInternalUser(item, index)
            });
            return;
        }

        this.buttonActions.push({
            label: 'Gestionar DPA',
            icon: 'pi pi-map',
            command: () => this.openAssignModal(item)
        });

        const isAvailableLabel = item.internalUser.isAvailable ? 'Marcar No Disponible' : 'Marcar Disponible';
        const isAvailableIcon = item.internalUser.isAvailable ? FontAwesome.BAN_SOLID : FontAwesome.CHECK_SOLID;

        this.buttonActions.push({
            label: isAvailableLabel,
            icon: isAvailableIcon,
            command: () => this.toggleAvailability(item)
        });

        // const isEnabledLabel = item.internalUser.enabled ? 'Deshabilitar Usuario' : 'Habilitar Usuario';
        // this.buttonActions.push({
        //     label: isEnabledLabel,
        //     icon: 'pi pi-power-off',
        //     command: () => this.toggleEnabled(item, index)
        // });
    }

    toggleAvailability(item: any) {
        console.log('toggleAvailability ejecutado:', item);
        const newStatus = !item.internalUser.isAvailable;
        this.service.availableInternalUser(item.internalUser.id, newStatus).subscribe({
            next: () => {
                this.loadData();

                this.customMessageService.showSuccess({
                    summary: 'Actualizado',
                    detail: 'Disponibilidad cambiada.'
                });
            },
            error: (err) => {
                console.error('Error al cambiar disponibilidad:', err);

                this.customMessageService.showError({
                    summary: 'Error',
                    detail: 'No se pudo cambiar la disponibilidad.'
                });
            }
        });
    }

    // toggleEnabled(item: any, index: number) {
    //     const newStatus = !item.enabled;
    //     this.confirmationService.confirm({
    //         message: `¿Está seguro de marcar este usuario como ${newStatus ? 'Disponible' : 'No Disponible'}?`,
    //         header: 'Cambiar Disponibilidad',
    //         icon: 'pi pi-exclamation-triangle',
    //         accept: async () => {
    //             //servicio
    //             await this.service.availableInternalUser(item.id,newStatus).subscribe()
    //             const updatedItems = [...this.items()];
    //             updatedItems[index].isAvailable = newStatus;
    //             this.items.set(updatedItems);

    //             this.customMessageService.showSuccess({ summary: 'Actualizado', detail: 'Disponibilidad cambiada.' });
    //         }
    //     });
    // }

    openAssignModal(item: any): void {
        this.selectedItem = item;
        this.isDpaModalVisible.set(true);
        this.loadAssignedDpas(item.internalUser.id);
    }

    closeDpaModal(): void {
        this.isDpaModalVisible.set(false);
        this.userDpas.set([]);
    }

    loadAssignedDpas(internalUserId: string): void {
        this.service.getDpasByInternalUserId(internalUserId).subscribe({
            next: (dpas) => this.userDpas.set(dpas.data)
        });
    }

    handleAddDpa(dpaId: string): void {
        if (!this.selectedItem) return;
        this.service.assignDpa(this.selectedItem.internalUser.id, dpaId).subscribe({
            next: () => this.loadAssignedDpas(this.selectedItem.internalUser.id)
        });
    }

    handleRemoveDpa(dpaId: string): void {
        if (!this.selectedItem) return;
        this.service.removeDpa(dpaId).subscribe({
            next: () => this.loadAssignedDpas(this.selectedItem.internalUser.id)
        });
    }

    handleToggleDpaProcess(event: { dpaId: string; hasProcess: boolean }): void {
        // this.service.updateDpaProcess(this.selectedItem.id, event.dpaId, event.hasProcess)...
    }
    handleToggleDpaEnabled(event: { dpaId: string; enabled: boolean }): void {
        this.service.enabledDpaInternalUser(event.dpaId, event.enabled).subscribe({
            next: () => this.loadAssignedDpas(this.selectedItem.internalUser.id),
            error: () => this.loadAssignedDpas(this.selectedItem.internalUser.id)
        });
    }

    registerAsInternalUser(item: any, index: number) {
        this.service.createInternalUser(item.id).subscribe({
            next: (newInternalUser) => {
                const updatedItems = [...this.items()];
                updatedItems[index].internalUser = newInternalUser;
                this.items.set(updatedItems);

                this.customMessageService.showSuccess({
                    summary: 'Éxito',
                    detail: 'El usuario ha sido registrado como Interno.'
                });

                this.isButtonActionsEnabled = false;
            }
        });
    }
}
