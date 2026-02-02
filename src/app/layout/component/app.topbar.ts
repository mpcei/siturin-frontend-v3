import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
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
                    <img [src]="environment.PATH_ASSETS + '/logo.png'" alt="Logo" width="50px" />
                    <span>{{ environment.APP_SHORT_NAME }}</span>
                </a>
            </div>

            <div class="layout-topbar-actions">
                <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                    <i [class]="FontAwesome.ELLIPSIS_SOLID"></i>
                </button>

                <div class="layout-topbar-menu hidden lg:block">
                    <div class="layout-topbar-menu-content">
                        @if (authService.auth && authService.role) {
                            <p-button type="button" (onClick)="redirectProfile()" [text]="true" [raised]="true" [rounded]="true" [label]="authService.auth.username" pTooltip="Mi Perfil" [icon]="FontAwesome.ID_CARD_CLIP_SOLID" />

                            <p-button type="button" [icon]="authService.role.icon" [text]="true" [raised]="true" [rounded]="true" severity="warn" [label]="authService.role.name" pTooltip="Mi Rol" />
                        }
                        <p-button (onClick)="signOut()" type="button" [raised]="true" [rounded]="true" severity="danger" pTooltip="Cerrar Sesión" [icon]="FontAwesome.POWER_OFF_SOLID" />
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

    items!: MenuItem[];

    layoutService = inject(LayoutService);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    signOut() {
        this.authHttpService.signOut().subscribe();
    }

    redirectProfile() {
        this.router.navigate([MY_ROUTES.adminPages.user.profile.absolute]);
    }

    protected readonly FontAwesome = FontAwesome;
    protected readonly environment = environment;
}
