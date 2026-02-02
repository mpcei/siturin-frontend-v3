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

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, Divider, FormsModule, Message, ReactiveFormsModule, Button, Tooltip],
    styles: [
        `
            .login-page {
                /* 1. Cambiamos fixed por relative o lo quitamos para que fluya */
                position: relative;
                width: 100%;
                /* 2. Usamos min-height para que crezca con el contenido */
                min-height: 100vh;

                /* 3. Imagen de fondo */
                background-image: url('/development/auth/images/background.png');
                background-repeat: no-repeat;
                background-position: center center;
                background-size: cover;
                background-attachment: fixed; /* Esto hace que el fondo se quede quieto mientras el formulario sube */

                /* 4. IMPORTANTE: Cambiar hidden por auto o simplemente quitarlo */
                overflow-y: auto;
            }

            .box {
                opacity: 0.95; /* Un poco más de opacidad ayuda a la lectura en formularios largos */
                margin-top: 2rem; /* Espacio opcional arriba y abajo */
                margin-bottom: 2rem;
            }

            .p-message p {
                font-size: 0.7rem;
            }
        `
    ],
    template: `
        <div class="login-page min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div
                class="box w-full max-w-7xl bg-white rounded-xl shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                <!-- COLUMNA IZQUIERDA -->
                <div class="p-6 lg:p-10 flex flex-col justify-center">
                    <!-- Logo / Header -->
                    <div class="flex justify-center">
                        <img [src]="environment.PATH_ASSETS + '/auth/images/logo.png'" alt="" class="mx-auto" />
                    </div>

                    <!-- Contenido dinámico -->
                    <!-- Aquí renderizas varios componentes -->
                    <ng-content select="[left-content]">
                        <router-outlet />
                        <p-button [label]="environment.VERSION" pTooltip="Versión del sistema"
                                  [icon]="FontAwesome.CODE_BRANCH_SOLID" [text]="true" />
                    </ng-content>
                </div>

                <!-- COLUMNA DERECHA -->
                <div class="bg-surface-100 p-6 lg:p-10 flex flex-col justify-center">
                    <!-- Bloque informativo superior -->
                    <div class="mb-6">
                        <ng-content select="[right-header]">
                            <div class="font-semibold text-xl text-center">{{ environment.APP_NAME }}</div>

                            <p-message severity="info">
                                <b>Importante:</b>
                                <p>Estimado Usuario, si su establecimiento se encuentra ubicado en el cantón Quito, por
                                    favor acérquese a las oficinas de "Quito Turismo" para solicitar su Certificado de
                                    Registro Turístico.</p>
                                <p>
                                    <b>Dirección:</b>
                                    Parque Bicentenario, terminales del antiguo Aeropuerto de Quito.
                                </p>

                                <p>
                                    <b>Teléfono:</b>
                                    (02) 2993 300 <b>extensiones</b> 1003, 1035 y 1068
                                </p>

                                <p><b>Correo electrónico:</b> <a href="mailto:info@quito-turismo.gob.ec">info@quito
                                    -turismo.gob.ec</a></p>
                            </p-message>
                        </ng-content>
                    </div>

                    <!-- Listado / pasos / información -->
                    <div class="space-y-6">
                        <ng-content select="[right-content]">
                            <div class="flex flex-col gap-2">
                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-2 flex flex-col gap-2">
                                        <i [class]="FontAwesome.DESKTOP_SOLID"
                                           style="font-size: 2rem;color:var(--text-color-secondary)"></i>
                                    </div>
                                    <div class="md:col-span-10 flex flex-col gap-2">
                                        <h6 class="mb-5" style="var(--text-color-secondary)">Simulador de Normativa</h6>
                                        <p>Permite validar si se cumple o no con los requisitos para acceder a una
                                            clasificación y categoría específica.</p>
                                    </div>
                                </div>
                                <p-divider />

                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-2 flex flex-col gap-2">
                                        <i [class]="FontAwesome.LIST_CHECK_SOLID"
                                           style="font-size: 2rem;color:var(--text-color-secondary)"></i>
                                    </div>
                                    <div class="md:col-span-10 flex flex-col gap-2">
                                        <h6 class="mb-5" style="var(--text-color-secondary)">5 Pasos para obtener un
                                            Registro de Turismo</h6>
                                        <p-button label="Descargar" [icon]="FontAwesome.DOWNLOAD_SOLID"
                                                  styleClass="w-full" [text]="true" [raised]="true" />
                                    </div>
                                </div>
                                <p-divider />

                                <a target="_blank" [href]="environment.PATH_ASSETS + '/files/auth/services.pdf'">
                                    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                        <div class="md:col-span-2 flex flex-col gap-2">
                                            <i [class]="FontAwesome.LIST_UL_SOLID"
                                               style="font-size: 2rem;color:var(--text-color-secondary)"></i>
                                        </div>
                                        <div class="md:col-span-10 flex flex-col gap-2">
                                            <h6 class="mb-5" style="var(--text-color-secondary)">Manual de usuario</h6>
                                            <p-button label="Descargar" [icon]="FontAwesome.DOWNLOAD_SOLID"
                                                      styleClass="w-full" [text]="true" [raised]="true" />
                                        </div>
                                    </div>
                                </a>
                                <p-divider />

                                <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div class="md:col-span-2 flex flex-col gap-2">
                                        <i [class]="FontAwesome.FILE_CONTRACT_SOLID"
                                           style="font-size: 2rem;color:var(--text-color-secondary)"></i>
                                    </div>
                                    <div class="md:col-span-10 flex flex-col gap-2">
                                        <h6 class="mb-5" style="var(--text-color-secondary)">TÉRMINOS Y CONDICIONES</h6>
                                        <p-button label="Descargar" [icon]="FontAwesome.DOWNLOAD_SOLID"
                                                  styleClass="w-full" [text]="true" [raised]="true" />
                                    </div>
                                </div>
                            </div>
                        </ng-content>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppLayoutAuth {
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
