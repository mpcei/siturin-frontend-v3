import { Component, inject } from '@angular/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '@layout/service';
import { FontAwesome } from '@/api/font-awesome';
import { environment } from '@env/environment';
import { AuthService } from '@/pages/auth/auth.service';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { MY_ROUTES } from '@routes';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, Button, Tooltip],
    styles: [
        `
            .layout-topbar {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .layout-topbar-center {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
            }

            .layout-topbar-center img {
                height: 40px;
            }
        `
    ],
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i [class]="FontAwesome.BARS_SOLID"></i>
                </button>

                <p-button type="button" (onClick)="redirectProfile()" [text]="true" [outlined]="true" [rounded]="true" [label]="authService.auth.username" pTooltip="Mi Perfil" [icon]="FontAwesome.ID_CARD_CLIP_SOLID" />
            </div>

            <div class="layout-topbar-center">
                <img [src]="environment.PATH_ASSETS + '/logo.png'" alt="Logo" />
            </div>

            <div class="layout-topbar-actions">
                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i [class]="FontAwesome.ELLIPSIS_SOLID"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        @if (authService.auth && authService.role) {
                            <!--                            <p-button type="button" (onClick)="redirectProfile()" [text]="true" [raised]="true" [outlined]="true" [rounded]="true" [label]="authService.auth.username" pTooltip="Mi Perfil" [icon]="FontAwesome.ID_CARD_CLIP_SOLID" />-->

                            <p-button type="button" [icon]="authService.role.icon" [text]="true" severity="secondary" [label]="authService.role.name" pTooltip="Mi Rol" />
                        }
                        <p-button (onClick)="signOut()" type="button" [raised]="true" [outlined]="true" [rounded]="true" severity="danger" pTooltip="Cerrar Sesión" [icon]="FontAwesome.POWER_OFF_SOLID" />
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppTopbar {
    protected readonly authService = inject(AuthService);
    protected readonly authHttpService = inject(AuthHttpService);
    private readonly router = inject(Router);
    private readonly confirmationService = inject(ConfirmationService);
    protected readonly FontAwesome = FontAwesome;
    protected readonly environment = environment;
    protected items!: MenuItem[];

    layoutService = inject(LayoutService);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
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

    redirectProfile() {
        this.router.navigate([MY_ROUTES.adminPages.user.profile.absolute]);
    }
}
