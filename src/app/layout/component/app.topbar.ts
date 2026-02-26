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
    template: `
        <div class="layout-topbar">
            <div class="layout-topbar-logo-container">
                <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                    <i [class]="FontAwesome.BARS_SOLID"></i>
                </button>

                <a class="layout-topbar-logo" routerLink="/">
                    <img [src]="environment.PATH_ASSETS + '/logo.png'" alt="Logo" width="75px" />
                </a>
                <!--                <p-button type="button" (onClick)="redirectProfile()" [text]="true" [outlined]="true" [rounded]="true" [label]="authService.auth.username" pTooltip="Mi Perfil" [icon]="FontAwesome.ID_CARD_CLIP_SOLID" />-->
            </div>

            <div class="layout-topbar-actions">
                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i [class]="FontAwesome.ELLIPSIS_SOLID"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        @if (authService.auth && authService.role) {
                            <p-button
                                type="button"
                                [label]="authService.auth.username"
                                [icon]="FontAwesome.ID_CARD_CLIP_SOLID"
                                pTooltip="Mi Perfil"
                                tooltipPosition="bottom"
                                [text]="true"
                                [raised]="true"
                                [outlined]="true"
                                [rounded]="true"
                                (onClick)="redirectProfile()"
                            />

                            <p-button type="button" [label]="authService.role.name" [icon]="authService.role.icon" severity="secondary" pTooltip="Mi Rol" tooltipPosition="bottom" [text]="true" />
                        }
                        <p-button type="button" [icon]="FontAwesome.POWER_OFF_SOLID" severity="danger" pTooltip="Cerrar Sesión" tooltipPosition="left" [raised]="true" [outlined]="true" [rounded]="true" (onClick)="signOut()" />
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
                outlined: true,
                raised: true
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
