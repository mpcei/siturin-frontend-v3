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
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { LabelDirective } from '@/utils/directives/label.directive';
import { DocumentValidatorStore } from '../document-validator.store';
import { FontAwesome } from '@/pages/public/icons/font-awesome';

@Component({
    selector: 'app-document-general-info',
    imports: [],
    template: `
        <!-- Encabezado de resultado -->
        <div class="flex items-center gap-3 mb-6">
            <i class="pi pi-verified text-3xl text-green-500"></i>
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Registro Encontrado</h2>
                <p class="text-sm text-gray-500">Los datos del establecimiento están vigentes en el catastro.</p>
            </div>
        </div>

        <!-- BLOQUE 1: DATOS DEL ESTABLECIMIENTO Y REGISTRO -->
        <div class="custom-form-section text-primary-600 border-b pb-1 mb-4 mt-6">Información General</div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">Número de Registro</span>
                <span class="text-base font-bold text-gray-900">{{ store.catastro().numeroRegistro }}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">Estado de Registro</span>
                <span class="text-sm mt-1">
                    <span class="px-2 py-1 bg-green-100 text-green-800 rounded font-medium border border-green-200">{{ store.catastro().estado?.nombre }}</span>
                </span>
            </div>
            <div class="flex flex-col lg:col-span-2">
                <span class="text-xs text-gray-500 uppercase font-semibold">Razón Social | Propietario</span>
                <span class="text-base font-bold text-gray-900">{{ store.catastro().tramite?.establecimiento?.ruc?.razonSocial }}</span>
            </div>
            <div class="flex flex-col lg:col-span-2">
                <span class="text-xs text-gray-500 uppercase font-semibold">Nombre Comercial</span>
                <span class="text-base font-bold text-gray-900">{{ store.catastro().tramite?.establecimiento?.nombreComercial }}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">RUC</span>
                <span class="text-base font-bold text-gray-900">{{ store.catastro().tramite?.establecimiento?.ruc?.numero }}</span>
            </div>
            <div class="flex flex-col">
                <span class="text-xs text-gray-500 uppercase font-semibold">Representante Legal</span>
                <span class="text-base font-bold text-gray-900">{{ store.catastro().tramite?.establecimiento?.ruc?.representanteLegalNombres }}</span>
            </div>
        </div>

    `
})
export class DocumentGeneralInfo implements OnInit {
    protected readonly store = inject(DocumentValidatorStore);

    protected FontAwesome = FontAwesome;
    ngOnInit(): void {}
}
