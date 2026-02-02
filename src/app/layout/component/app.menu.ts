import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { MY_ROUTES } from '@routes';
import { AuthService } from '@modules/auth/auth.service';
import { RoleEnum } from '@utils/enums';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { FontAwesome } from '@/api/font-awesome';
import { environment } from '@env/environment';
import { Button } from 'primeng/button';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule, Button, Fluid],
    styles: [
        `
            /* Contenedor real del sidebar */
            .layout-sidebar,
            .p-sidebar,
            .p-drawer {
                height: 100vh !important;
                display: flex;
                flex-direction: column;
            }

            /* Contenido interno */
            .sidebar-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-height: 0; /* MUY IMPORTANTE */
            }

            .sidebar-footer {
                padding-bottom: 2rem;
            }

            .sidebar-footer .p-button {
                width: 100%;
                justify-content: center;
            }
        `
    ],
    template: `
        <div class="flex flex-column h-full sidebar-content">
            <!-- MENÚ -->
            <ul class="layout-menu flex-1 overflow-y-auto">
                @for (item of model; track item.label) {
                    @if (!item.separator) {
                        <li app-menuitem [item]="item" [root]="true"></li>
                    } @else {
                        <li class="menu-separator"></li>
                    }
                }
            </ul>

            <!-- FOOTER -->
            <div class="sidebar-footer mt-auto">
                <hr class="mx-4 my-3 border-surface" />

                <p-fluid>
                    <div>
                        <p-button text size="small" severity="secondary" [icon]="FontAwesome.CODE_BRANCH_SOLID" [label]="environment.VERSION" />
                    </div>

                    <div>
                        <p-button outlined size="small" severity="danger" [icon]="FontAwesome.POWER_OFF_SOLID" label="Cerrar Sesión" (onClick)="signOut()" />
                    </div>
                </p-fluid>
            </div>
        </div>
    `
})
export class AppMenu {
    protected readonly authService = inject(AuthService);
    protected readonly authHttpService = inject(AuthHttpService);

    protected model: MenuItem[] = [];
    protected readonly FontAwesome = FontAwesome;
    protected readonly environment = environment;
    private readonly confirmationService = inject(ConfirmationService);

    get loadMenu(): MenuItem[] {
        switch (this.authService.role.code) {
            case RoleEnum.ADMIN:
                return this.adminMenu;
            case RoleEnum.OWNER:
                return this.ownerMenu;
            case RoleEnum.CUSTOMER:
                return this.customerMenu;
            default:
                return [];
        }
    }

    get adminMenu(): MenuItem[] {
        return [
            {
                label: 'Usuarios',
                icon: FontAwesome.USERS_SOLID,
                routerLink: [MY_ROUTES.adminPages.user.absolute]
            }
        ];
    }

    get ownerMenu(): MenuItem[] {
        return [
            {
                label: 'Citas',
                icon: FontAwesome.CALENDAR_SOLID,
                routerLink: [MY_ROUTES.corePages.owner.appointments.absolute]
            }
        ];
    }

    get customerMenu(): MenuItem[] {
        return [
            {
                label: 'Mis Citas',
                icon: FontAwesome.CALENDAR_SOLID,
                routerLink: [MY_ROUTES.corePages.owner.appointments.absolute]
            },
            {
                label: 'Cancelar Cita',
                icon: FontAwesome.CALENDAR_XMARK_SOLID,
                routerLink: [MY_ROUTES.corePages.owner.appointments.absolute]
            }
        ];
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: FontAwesome.HOUSE_REGULAR, routerLink: ['/'] },
                    {
                        label: 'Mi Perfil',
                        icon: FontAwesome.USER_REGULAR,
                        routerLink: [MY_ROUTES.adminPages.user.profile.absolute]
                    }
                ]
            },
            {
                separator: true
            },
            {
                label: 'Gestión',
                items: [...this.loadMenu]
            }
        ];
    }

    signOut() {
        this.confirmationService.confirm({
            message: '¿Está seguro de salir del sistema?',
            header: 'Salir del Sistema',
            icon: FontAwesome.POWER_OFF_SOLID,
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Salir',
                severity: 'danger',
                outlined: true
            },
            accept: () => {
                this.authHttpService.signOut().subscribe();
            },
            key: 'confirmdialog'
        });
    }
}
