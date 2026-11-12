import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '@layout/service';
import { Divider } from 'primeng/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { environment } from '@env/environment';
import { MY_ROUTES } from '@routes';
import { FontAwesome } from '@modules/public/icons/font-awesome';
import { Button } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, Divider, FormsModule, Message, ReactiveFormsModule, Button, Tooltip],
    styles: [
        `
            .login-page {
                position: relative;
                width: 100%;
                min-height: 100vh;
                background-image: url('/development/auth/images/background.png');
                background-repeat: no-repeat;
                background-position: center center;
                background-size: cover;
                background-attachment: fixed;
                overflow-y: auto;
            }
            .box {
                opacity: 0.97;
                margin-top: 2rem;
                margin-bottom: 2rem;
            }
            /* Animación sutil para el bloque destacado */
            .catastro-highlight {
                background: linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%);
                box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
            }
        `
    ],
    template: `
        <div class="login-page min-h-screen flex items-center justify-center bg-gray-900/20 px-4 py-6">
            <div
                class="box w-full max-w-7xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-7 border border-white/40">

                <!-- COLUMNA IZQUIERDA (LOGIN) -->
                <div class="lg:col-span-3 p-6 lg:p-10 flex flex-col justify-between bg-white relative">
                    <!-- Barra superior decorativa de color -->
                    <div
                        class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500"></div>

                    <div class="my-auto">
                        <!-- Logo / Header -->
                        <div class="flex justify-center mb-6">
                            <img [src]="environment.APP_PATH_ASSETS + '/auth/images/logo.png'" alt="Logo SITURIN"
                                 class="mx-auto max-h-36 object-contain drop-shadow-sm" />
                        </div>

                        <!-- Contenido dinámico (Formulario) -->
                        <ng-content select="[left-content]">
                            <router-outlet />
                        </ng-content>
                    </div>

                    <!-- Footer Versión -->
                    <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <p-button severity="secondary" [label]="environment.APP_VERSION" pTooltip="Versión del sistema"
                                  [icon]="FontAwesome.CODE_BRANCH_SOLID" [text]="true" size="small" />
                        <span class="text-xs text-slate-400 font-medium">SITURIN</span>
                    </div>
                </div>

                <!-- COLUMNA DERECHA (INFORMACIÓN Y ACCESOS) -->
                <div
                    class="lg:col-span-4 bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/50 p-6 lg:p-10 flex flex-col justify-between border-l border-slate-200/80">

                    <div>


                        <!-- Listado / pasos / información -->
                        <div class="space-y-5">
                            <ng-content select="[right-content]">

                                <!-- 1. DESTACADO: CONSULTA CATASTRO TURÍSTICO NACIONAL -->
                                <div (click)="goToConsultaCatastro()"
                                     class="catastro-highlight group relative overflow-hidden rounded-2xl p-6 text-white transition-all duration-300 hover:scale-[1.01] hover:shadow-xl cursor-pointer">
                                    <!-- Círculo decorativo de fondo -->
                                    <div
                                        class="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

                                    <div
                                        class="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div class="flex items-start gap-4">
                                            <!-- Ícono grande destacado -->
                                            <div
                                                class="p-3.5 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
                                                <i [class]="FontAwesome.MAGNIFYING_GLASS_SOLID + ' text-2xl text-white'"></i>
                                            </div>
                                            <div>
                                                <div class="flex flex-wrap items-center gap-2 mb-1.5">
                                                    <span
                                                        class="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 rounded-full shadow-sm">
                                                        ★ Destacado
                                                    </span>
                                                    <span class="text-xs font-medium text-sky-100">
                                                        Acceso Público Directo
                                                    </span>
                                                </div>
                                                <h3 class="text-xl font-bold text-white tracking-tight">
                                                    Consulta Catastro Turístico Nacional
                                                </h3>
                                                <p class="text-sky-100 text-xs sm:text-sm mt-1 leading-relaxed">
                                                    Consulte aquellos prestadores de servicios que cuentan con un
                                                    Registro de Turismo y forman parte del Catastro Turístico Nacional
                                                </p>
                                            </div>
                                        </div>

                                        <!-- Botón de acción llamativo -->
                                        <div class="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                                            <button type="button"
                                                    class="w-full sm:w-auto px-5 py-2.5 bg-white text-blue-700 hover:bg-amber-300 hover:text-slate-900 font-bold text-sm rounded-xl shadow-md transition-colors duration-200 flex items-center justify-center gap-2">
                                                <span>Consultar ahora</span>
                                                <i [class]="FontAwesome.ARROW_UP_RIGHT_FROM_SQUARE_SOLID + ' text-xs'"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- 2. SIMULADOR DE NORMATIVA -->
                                <div (click)="goToSimulator()"
                                     class="group bg-white hover:bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 cursor-pointer">
                                    <div
                                        class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                        <i [class]="FontAwesome.ARROW_UP_RIGHT_FROM_SQUARE_SOLID + ' text-lg'"></i>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex items-center justify-between">
                                            <h6 class="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                                                Simulador de Normativa
                                            </h6>
                                            <span
                                                class="text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                                                Ir al simulador →
                                            </span>
                                        </div>
                                        <p class="text-xs text-slate-600 mt-0.5">
                                            Permite validar si se cumple o no con los requisitos para acceder a una
                                            clasificación y categoría específica.
                                        </p>
                                    </div>
                                </div>

                                <!-- 3. MANUALES DE USUARIO Y DOCUMENTOS -->
                                <div class="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm">
                                    <h6 class="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
                                        <span class="w-2 h-2 rounded-full bg-indigo-500"></span>
                                        Manuales de Usuario y Documentación
                                    </h6>

                                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <!-- Manuales Internos -->
                                        <div
                                            class="bg-indigo-50/60 border border-indigo-100 rounded-lg p-3 flex flex-col items-center text-center">
                                            <span
                                                class="text-xs font-bold text-indigo-900 mb-2 uppercase tracking-wider">
                                                Usuario Interno
                                            </span>
                                            <div class="flex gap-2 w-full justify-center">
                                                <p-button pTooltip="Manual Guianza (Interno)"
                                                          [icon]="FontAwesome.DOWNLOAD_SOLID"
                                                          size="small"
                                                          severity="info"
                                                          [raised]="true"
                                                          (onClick)="downloadPDF('manual_guianza_internal')"></p-button>
                                                <p-button pTooltip="Manual Otras Actividades (Interno)"
                                                          [icon]="FontAwesome.DOWNLOAD_SOLID"
                                                          size="small"
                                                          severity="info"
                                                          [outlined]="true"
                                                          (onClick)="downloadPDF('manual_internal')"></p-button>
                                            </div>
                                        </div>

                                        <!-- Manuales Externos -->
                                        <div
                                            class="bg-purple-50/60 border border-purple-100 rounded-lg p-3 flex flex-col items-center text-center">
                                            <span
                                                class="text-xs font-bold text-purple-900 mb-2 uppercase tracking-wider">
                                                Usuario Externo
                                            </span>
                                            <div class="flex gap-2 w-full justify-center">
                                                <p-button pTooltip="Manual Guianza (Externo)"
                                                          [icon]="FontAwesome.DOWNLOAD_SOLID"
                                                          size="small"
                                                          severity="help"
                                                          [raised]="true"
                                                          (onClick)="downloadPDF('manual_guianza_external')"></p-button>
                                                <p-button pTooltip="Manual Otras Actividades (Externo)"
                                                          [icon]="FontAwesome.DOWNLOAD_SOLID"
                                                          size="small"
                                                          severity="help"
                                                          [outlined]="true"
                                                          (onClick)="downloadPDF('manual_external')"></p-button>
                                            </div>
                                        </div>

                                        <!-- Términos y Condiciones -->
                                        <div
                                            class="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex flex-col items-center justify-between text-center">
                                            <span
                                                class="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                                Legal
                                            </span>
                                            <p-button pTooltip="Descargar Términos y Condiciones"
                                                      [icon]="FontAwesome.DOWNLOAD_SOLID"
                                                      label="Términos"
                                                      size="small"
                                                      severity="secondary"
                                                      [raised]="true"
                                                      styleClass="w-full"
                                                      (onClick)="downloadPDF('legal')"></p-button>
                                        </div>
                                    </div>
                                </div>

                            </ng-content>
                        </div>
                    </div>

                    <!-- 4. AVISO IMPORTANTE (QUITO TURISMO) -->
                    <div
                        class="mt-5 bg-amber-50/90 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-sm text-xs text-amber-950 space-y-2">
                        <div class="flex items-start gap-2.5">
                            <i [class]="FontAwesome.TRIANGLE_EXCLAMATION_SOLID + ' text-amber-600 text-base mt-0.5 shrink-0'"></i>
                            <p class="leading-relaxed">
                                <b class="text-amber-900 uppercase tracking-wide">Importante:</b> Estimado Usuario, si
                                su establecimiento o su actividad de guianza turística la realiza dentro del cantón
                                Quito, por favor acérquese a las oficinas de <b>Quito Turismo</b> para solicitar su <b>Certificado
                                de Registro Turístico</b>.
                            </p>
                        </div>

                        <div
                            class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-200/70 text-[11px] text-amber-900">
                            <div class="flex items-center gap-2">
                                <i [class]="FontAwesome.LOCATION_DOT_SOLID + ' text-amber-600'"></i>
                                <span><b>Dirección:</b> Parque Bicentenario, antiguo Aeropuerto.</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i [class]="FontAwesome.PHONE_SOLID + ' text-amber-600'"></i>
                                <span><b>Teléfono:</b> (02) 2993 300 <b>ext.</b> 1003, 1035, 1068</span>
                            </div>
                            <div class="sm:col-span-2 flex items-center gap-2">
                                <i [class]="FontAwesome.ENVELOPE_SOLID + ' text-amber-600'"></i>
                                <span>
                                    <b>Correo electrónico:</b>
                                    <a href="mailto:info@quito-turismo.gob.ec"
                                       class="underline font-semibold hover:text-amber-700 ml-1">
                                        info@quito-turismo.gob.ec
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `
})
export default class AppLayoutAuth {
    layoutService = inject(LayoutService);
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
    protected readonly environment = environment;
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly FontAwesome = FontAwesome;
    private readonly router = inject(Router);

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

    goToSimulator() {
        window.open(this.router.serializeUrl(this.router.createUrlTree([MY_ROUTES.publicPages.simulator.absolute])), '_blank');
    }

    goToConsultaCatastro() {
        window.open(this.router.serializeUrl(this.router.createUrlTree([MY_ROUTES.consultaCatastro.absolute])), '_blank');
    }

    downloadPDF(file: string) {
        switch (file) {
            case 'steps':
                window.open(`${environment.APP_PATH_ASSETS}/auth/files/steps.pdf`, '_blank');
                break;
            case 'manual_guianza_internal':
                window.open(`${environment.APP_PATH_ASSETS}/auth/files/manual_guianza_internal.pdf`, '_blank');
                break;
            case 'manual_internal':
                window.open(`${environment.APP_PATH_ASSETS}/auth/files/manual_internal.pdf`, '_blank');
                break;
            case 'manual_guianza_external':
                window.open(`${environment.APP_PATH_ASSETS}/auth/files/manual_guianza_external.pdf`, '_blank');
                break;
            case 'manual_external':
                window.open(`${environment.APP_PATH_ASSETS}/auth/files/manual_external.pdf`, '_blank');
                break;
            case 'legal':
                window.open(`${environment.APP_PATH_ASSETS}/auth/files/legal.pdf`, '_blank');
                break;
        }
    }
}
