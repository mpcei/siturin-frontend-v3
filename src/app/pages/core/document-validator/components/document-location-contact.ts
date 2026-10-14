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
import { DocumentValidatorStore } from '../document-validator.store';

@Component({
    selector: 'app-document-location-contact',
    imports: [],
    template: `
        <!-- BLOQUE 2: UBICACIÓN Y CONTACTO -->
        <div class="custom-form-section text-primary-600 border-b pb-1 mb-4 mt-8">Ubicación y Contacto</div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">Territorio (Prov / Can / Parr)</span>
                <span class="text-base font-medium text-gray-900"> {{ store.catastro().tramite?.establecimiento?.provincia?.nombre }} / {{ store.catastro().tramite?.establecimiento?.canton?.nombre }} / {{ store.catastro().tramite?.establecimiento?.parroquia?.nombre }} </span>
            </div>
            <div class="flex flex-col lg:col-span-2">
                <span class="text-xs text-gray-500 uppercase font-semibold">Dirección Exacta</span>
                <span class="text-base font-medium text-gray-900">
                    {{ store.catastro().tramite?.establecimiento?.ubicacion?.callePrincipal }}, {{ store.catastro().tramite?.establecimiento?.ubicacion?.calleNumeracion }}, {{ store.catastro().tramite?.establecimiento?.ubicacion?.calleInterseccion }}
                </span>
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">Teléfono Principal</span>
                <span class="text-base font-medium text-gray-900">{{ store.catastro().tramite?.establecimiento?.personaContacto?.telefonoPrincipal }}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">Correo Electrónico</span>
                <span class="text-base font-medium text-gray-900">{{ store.catastro().tramite?.establecimiento?.personaContacto?.correo }}</span>
            </div>
        </div>

        <!-- BLOQUE 3: ACTIVIDAD TURÍSTICA -->
        <div class="custom-form-section text-primary-600 border-b pb-1 mb-4 mt-8">Clasificación Turística</div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            @if (store.catastro().tramite?.actividad?.codigo === 'ctc_continente' || store.catastro().tramite?.actividad?.codigo === 'ctc_galapagos') {
            <div class="flex flex-col lg:col-span-2">
                <span class="text-xs text-gray-500 uppercase font-semibold">Modalidad Turística</span>
                <span class="text-base font-bold text-gray-900">{{ store.catastro().tramite?.actividad?.nombre }}</span>
            </div>
            } @else {
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">Actividad</span>
                <span class="text-base font-bold text-gray-900">{{ store.catastro().tramite?.actividad?.nombre }}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">Clasificación</span>
                <span class="text-base font-bold text-gray-900">{{ store.catastro().tramite?.clasificacion?.nombre }}</span>
            </div>
            }
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">Categoría</span>
                <span class="text-base font-bold text-gray-900">{{ store.catastro().tramite?.categoria?.nombre }}</span>
            </div>
        </div>

    `
})
export class DocumentLocationContact implements OnInit {
    protected readonly store = inject(DocumentValidatorStore);
    protected FontAwesome = FontAwesome;

    ngOnInit(): void {}
}
