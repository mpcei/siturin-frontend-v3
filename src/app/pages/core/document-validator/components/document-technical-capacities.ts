import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { CatastrosHttpService } from '@services/siturin';
import { CatastroModel } from '@models/siturin';
import { MessageService } from '@services/core';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { Divider } from 'primeng/divider';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { LabelDirective } from '@/utils/directives/label.directive';
import { SkeletonComponent } from '@/utils/components/skeleton/skeleton.component';
import { DocumentValidatorStore } from '../document-validator.store';

@Component({
    selector: 'app-document-technical-capacities',
    imports: [FormsModule],
    template: `
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 mt-8 mb-6">
            <h4 class="text-sm font-bold text-gray-700 uppercase mb-4 border-b pb-2">Capacidades e Instalaciones</h4>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- ALIMENTOS Y BEBIDAS -->
                @if (store.catastro().tramite?.actividad?.codigo?.includes('alimentos_bebidas') || store.catastro().tramite?.actividad?.codigo?.includes('parques') || store.catastro().tramite?.actividad?.codigo?.includes('eventos')) {
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500 font-semibold">Aforo (Personas)</span>
                    <span class="text-xl font-bold text-primary">{{ store.catastro().tramite?.tramiteAlimentoBebida?.totalCapacidades || store.catastro().tramite?.tramiteParque?.totalCapacidades || store.catastro().tramite?.tramiteEvento?.totalCapacidades || 0 }}</span>
                </div>
                }

                <!-- ALOJAMIENTO -->
                @if (store.catastro().tramite?.actividad?.codigo?.includes('alojamiento') && store.catastro().tramite?.habitaciones?.length) {
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500 font-semibold">Habitaciones</span>
                    <span class="text-xl font-bold text-primary">{{ totalHabitaciones() }}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500 font-semibold">Camas</span>
                    <span class="text-xl font-bold text-primary">{{ totalCamas() }}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500 font-semibold">Plazas</span>
                    <span class="text-xl font-bold text-primary">{{ totalPlazas() }}</span>
                </div>
                }

                <!-- TRANSPORTE MARÍTIMO -->
                @if (store.catastro().tramite?.actividad?.codigo?.includes('transporte') && store.catastro().tramite?.clasificacion?.codigo === 'maritimo') {
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500 font-semibold">Unidades (Embarcaciones)</span>
                    <span class="text-xl font-bold text-primary">{{ store.catastro().tramite?.tramiteTransporte?.totalUnidades }}</span>
                </div>
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500 font-semibold">Total Puestos</span>
                    <span class="text-xl font-bold text-primary">{{ store.catastro().tramite?.tramiteTransporte?.totalAsientos }}</span>
                </div>
                }

                <!-- TRANSPORTE TERRESTRE -->
                @if (store.catastro().tramite?.actividad?.codigo?.includes('transporte') && store.catastro().tramite?.clasificacion?.codigo === 'terrestre') {
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500 font-semibold">Capacidad Total de Vehículos</span>
                    <span class="text-xl font-bold text-primary">{{ totalCapacidades() }}</span>
                </div>
                }

                <!-- TURISMO AVENTURA -->
                @if (store.catastro().tramite?.clasificacion?.codigo !== 'inmuebles_habitacionales' && store.catastro().tramite?.actividad?.codigo !== 'transporte_continente' && store.catastro().tramite?.actividad?.codigo !== 'transporte_galapagos') {
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500 font-semibold">Oferta Turismo de Aventura</span>
                    <span class="text-base font-bold text-primary">{{ store.catastro().tramite?.modalidadesTurismoAventura?.length ? 'SÍ OFERTA' : 'NO OFERTA' }}</span>
                </div>
                }
            </div>

            <!-- Listas técnicas detalladas dentro del cuadro -->
            @if (store.catastro().tramite?.actividad?.codigo?.includes('alojamiento') && store.catastro().tramite?.clasificacion?.codigo !== 'inmuebles_habitacionales') {
            <div class="mt-4 pt-4 border-t border-gray-200">
                <span class="text-xs text-gray-500 font-semibold block mb-2">Servicios Complementarios</span>
                <div class="flex flex-wrap gap-2">
                    @for (servicio of store.catastro().tramite?.serviciosComplementarios; track $index) {
                    <span class="px-2 py-1 bg-white border rounded text-xs text-gray-700 shadow-sm">{{ servicio?.clasificacion?.nombre }}: {{ servicio?.capacidad }}</span>
                    } @empty {
                    <span class="text-sm text-gray-500">No registra</span>
                    }
                </div>
            </div>
            } @if (store.catastro().tramite?.modalidadesTurismoAventura?.length && store.catastro().tramite?.clasificacion?.codigo !== 'inmuebles_habitacionales') {
            <div class="mt-4 pt-4 border-t border-gray-200">
                <span class="text-xs text-gray-500 font-semibold block mb-2">Modalidades de Aventura</span>
                <ul class="list-disc list-inside text-sm text-gray-700">
                    @for (modalidad of store.catastro().tramite?.modalidadesTurismoAventura; track $index) {
                    <li>{{ modalidad.tipo?.nombre }}</li>
                    }
                </ul>
            </div>
            }
        </div>
        <div class="custom-form-section text-gray-400 text-sm border-b pb-1 mb-4 mt-8">Gestión Institucional</div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2 text-sm">
            <div class="flex flex-col">
                <span class="text-xs text-gray-400 uppercase">Técnico Responsable</span>
                <span class="text-gray-700">{{ store.catastro().tramite?.asignacionActual?.usuarioInterno?.user?.name || 'N/A' }}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-gray-400 uppercase">Dirección Zonal</span>
                <span class="text-gray-700">{{ store.catastro().tramite?.establecimiento?.provincia?.zonal?.nombre || 'N/A' }}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-gray-400 uppercase">Director Zonal</span>
                <span class="text-gray-700">{{ store.catastro().tramite?.establecimiento?.provincia?.zonal?.director || 'N/A' }}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-gray-400 uppercase">Fecha de Registro</span>
                <span class="text-gray-700">{{ store.catastro().fechaRegistro }}</span>
            </div>
        </div>
    `,
})
export class DocumentTechnicalCapacities implements OnInit {
    protected readonly store = inject(DocumentValidatorStore);
    protected FontAwesome=FontAwesome


    totalHabitaciones = computed(() => {
        const habitaciones = this.store.catastro()?.tramite?.habitaciones || [];
        return habitaciones.reduce((sum, h) => sum + (h?.habitaciones || 0), 0);
    });

    totalCamas = computed(() => {
        const habitaciones = this.store.catastro()?.tramite?.habitaciones || [];
        return habitaciones.reduce((sum, h) => sum + (h?.camas || 0), 0);
    });

    totalPlazas = computed(() => {
        const habitaciones = this.store.catastro()?.tramite?.habitaciones || [];
        return habitaciones.reduce((sum, h) => sum + (h?.plazas || 0), 0);
    });

    totalCapacidades = computed(() => {
        const transportes = this.store.catastro()?.tramite?.transporteTerrestres || [];
        return transportes.reduce((sum, t) => sum + (t?.capacidad || 0), 0);
    });
    ngOnInit(): void {

    }


}
