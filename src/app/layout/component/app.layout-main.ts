import { Component, computed, effect, inject, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { LayoutService } from '@layout/service';
import { Divider } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { environment } from '@env/environment';
import { MY_ROUTES } from '@routes';
import { FontAwesome } from '@/api/font-awesome';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { AppFooter } from '@layout/component/app.footer';
import { AppBreadcrumb } from '@layout/component/app.breadcrumb';

@Component({
    selector: 'app-layout-main',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, AppBreadcrumb],
    template: `
        <div class="layout-wrapper" [ngClass]="containerClass()">
            <app-topbar />
            <app-sidebar />
            <div class="layout-main-container">
                <app-breadcrumb />

                <div class="layout-main">
                    <router-outlet />
                </div>

                <app-footer />
            </div>
            <div class="layout-mask"></div>
        </div>
    `
})
export class AppLayoutMain {
    layoutService = inject(LayoutService);
    protected readonly environment = environment;
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly FontAwesome = FontAwesome;

    constructor() {
        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.mobileMenuActive) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.classList.remove('blocked-scroll');
            }
        });
    }

    containerClass = computed(() => {
        const config = this.layoutService.layoutConfig();
        const state = this.layoutService.layoutState();
        return {
            'layout-overlay': config.menuMode === 'overlay',
            'layout-static': config.menuMode === 'static',
            'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.mobileMenuActive
        };
    });
}
