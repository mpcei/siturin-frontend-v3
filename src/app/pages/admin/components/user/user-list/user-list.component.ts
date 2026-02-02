import { Component, inject, OnInit } from '@angular/core';
import { ListComponent } from '@utils/components/list/list.component';
import { UserHttpService } from '@/pages/admin/user-http.service';
import { ColInterface, PaginationInterface } from '@utils/interfaces';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { BreadcrumbService } from '@layout/service';
import { activateButtonAction, deleteButtonAction, editButtonAction, suspendButtonAction } from '@utils/components/button-action/consts';
import { CustomMessageService } from '@utils/services';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { UserInterface } from '@/pages/auth/interfaces';
import { AuthService } from '@/pages/auth/auth.service';
import { FontAwesome } from '@/api/font-awesome';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';

@Component({
    selector: 'app-user-list',
    imports: [ListComponent, ButtonActionComponent],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss'
})
export default class UserListComponent implements OnInit {
    protected cols: ColInterface[] = [];
    protected items: UserInterface[] = [];
    protected selectedItem!: UserInterface;
    protected pagination!: PaginationInterface;
    protected buttonActions: MenuItem[] = [];
    protected isButtonActionsEnabled: boolean = false;
    protected currentSearch: string = '';

    protected readonly router = inject(Router);
    protected readonly customMessageService = inject(CustomMessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly authService = inject(AuthService);
    private readonly userHttpService = inject(UserHttpService);
    visible = false;
    constructor() {
        this.breadcrumbService.setItems([{ label: 'Listado de Usuarios' }]);

        this.buildColumns();
    }

    ngOnInit() {
        this.loadData();
    }

    loadData(page = 1) {
        this.userHttpService.findAll(page, this.currentSearch).subscribe({
            next: (response: any) => {
                this.items = response.data;
                this.pagination = response.pagination;
            }
        });
    }

    buildColumns() {
        this.cols = [
            { header: 'Identificación', field: 'identification' },
            { header: 'Nombres', field: 'name' },
            { header: 'Apellidos', field: 'lastname' },
            { header: 'Email', field: 'email' },
            { header: 'Email', field: 'createdAt' },
            { header: 'Roles', field: 'roles', type: 'arrayObject', objectName: 'name' }
        ];
    }

    buildButtonActions(item: any, index: number) {
        this.buttonActions = [
            {
                ...editButtonAction,
                command: () => {
                    this.edit(item.id);
                }
            },
            {
                ...deleteButtonAction,
                command: () => {
                    this.delete(item.id, index);
                }
            }
        ];

        if (this.authService.auth.id !== item.id) {
            if (item.suspendedAt) {
                this.buttonActions.push({
                    ...activateButtonAction,
                    command: () => {
                        this.activate(item.id, index);
                    }
                });
            } else {
                this.buttonActions.push({
                    ...suspendButtonAction,
                    command: () => {
                        this.suspend(item.id, index);
                    }
                });
            }
        }
    }

    delete(id: string, index: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar?',
            header: 'Eliminar',
            icon: FontAwesome.TRASH_CAN_SOLID,
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
                this.userHttpService.delete(id).subscribe({
                    next: (_) => {
                        this.items.splice(index, 1);
                    }
                });
            },
            key: 'confirmdialog'
        });
    }

    suspend(id: string, index: number) {
        this.confirmationService.confirm({
            message: '¿Está seguro de suspender al usuario?',
            header: 'Suspender',
            icon: FontAwesome.BAN_SOLID,
            rejectButtonStyleClass: 'p-button-text',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'danger',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Suspender'
            },
            accept: () => {
                this.userHttpService.suspend(id).subscribe({
                    next: (_) => {
                        this.items[index].suspendedAt = new Date();
                    }
                });
            },
            key: 'confirmdialog'
        });
    }

    activate(id: string, index: number) {
        this.userHttpService.activate(id).subscribe({
            next: (_) => {
                this.items[index].suspendedAt = null;
            }
        });
    }

    edit(id: string) {
        this.router.navigate([MY_ROUTES.adminPages.user.form.absolute, id]);
    }

    onCreate() {
        this.router.navigate([MY_ROUTES.adminPages.user.form.absolute]);
    }

    onSearch(search: string) {
        this.currentSearch = search || '';
        this.loadData();
    }

    onPagination(page: number) {
        this.loadData(page);
    }

    onSelect({ item, index }: { item: any; index: number }) {
        if (!item) {
            this.customMessageService.showError({ summary: 'El registro no existe', detail: 'Vuelva a intentar' });
            return;
        }

        this.selectedItem = item;
        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
    }
}
