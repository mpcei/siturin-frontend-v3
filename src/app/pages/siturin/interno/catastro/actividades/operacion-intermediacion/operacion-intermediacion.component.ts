import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ColumnModel } from '@models/core';
import { CoreService, MessageService } from '@services/core';
import { CompaniaTransporteTuristicoModel, GuiaTurismoModel, RepresentanteVentaModel } from '@models/siturin';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-operacion-intermediacion',
    templateUrl: './operacion-intermediacion.component.html',
    styleUrls: ['./operacion-intermediacion.component.scss'],
    imports: [Bind, Card, TableModule, PrimeTemplate, NgFor, NgIf, Tag, AsyncPipe]
})
export class OperacionIntermediacionComponent implements OnInit {
    @Output() operacionIntermediacionOut: EventEmitter<any> = new EventEmitter<any>();
    @Input() companiasTransporteTuristico: CompaniaTransporteTuristicoModel[] = [];
    @Input() guiasTurismo: GuiaTurismoModel[] = [];
    @Input() representantesVentas: RepresentanteVentaModel[] = [];
    @Input() esEditable: boolean = false;
    private coreService = inject(CoreService);
    private formBuilder = inject(UntypedFormBuilder);
    public messageService = inject(MessageService);
    formulario: FormGroup = this.nuevoFormulario;
    columnasCompaniasTransporteTuristicoTabla: ColumnModel[] = this.configurarColumnasCompaniasTransporteTuristicoTabla();
    columnasGuiasTurismoTabla: ColumnModel[] = this.configurarColumnasGuiasTurismoTabla();
    columnasRepresentantesVentasTabla: ColumnModel[] = this.configurarColumnasRepresentantesVentasTabla();
    cargado$ = this.coreService.loaded$;

    constructor() {}

    ngOnInit(): void {
        if (!this.esEditable) {
            this.formulario.disable();
        }

        this.companiasTransporteTuristicoField.patchValue(this.companiasTransporteTuristico);
        this.guiasTurismoField.patchValue(this.guiasTurismo);
        this.representantesVentasField.patchValue(this.representantesVentas);
    }

    configurarColumnasRepresentantesVentasTabla(): ColumnModel[] {
        return [
            { field: 'numeroRuc', header: 'RUC' },
            { field: 'razonSocial', header: 'Razón Social' },
            { field: 'tieneTituloProfesional', header: 'Título Profesional' },
            { field: 'tieneContrato', header: 'Contrato Suscrito' },
            { field: 'tieneExperenciaLaboral', header: 'Experiencia Probada' }
        ];
    }

    configurarColumnasGuiasTurismoTabla(): ColumnModel[] {
        return [
            { field: 'numeroCedula', header: 'Identificación' },
            { field: 'nombres', header: 'Nombres Completo' },
            { field: 'esGuia', header: 'Es Guía' }
        ];
    }

    configurarColumnasCompaniasTransporteTuristicoTabla(): ColumnModel[] {
        return [
            { field: 'numeroRuc', header: 'RUC' },
            { field: 'razonSocial', header: 'Razón Social' },
            { field: 'tipoContribuyente', header: 'Tipo Contribuyente' }
        ];
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            normativaRespuestas: [[]],
            normativaRespuestasModalidadesTurismoAventura: [[]],
            tieneCompaniasTransporteTuristico: [false],
            tieneGuiasTurismo: [false],
            tieneRepresentantesVentas: [false],
            tieneModalidadesTurismoAventura: [false],
            companiasTransporteTuristico: [[]],
            guiasTurismo: [[]],
            representantesVentas: [[]],
            modalidadesTurismoAventura: [[]],
            modalidadesTurismoAventuraAgua: [[]],
            modalidadesTurismoAventuraAire: [[]],
            modalidadesTurismoAventuraTierra: [[]]
        });
    }

    get companiasTransporteTuristicoField() {
        return this.formulario.controls['companiasTransporteTuristico'];
    }

    get guiasTurismoField() {
        return this.formulario.controls['guiasTurismo'];
    }

    get representantesVentasField() {
        return this.formulario.controls['representantesVentas'];
    }
}
