import { Component, inject, Input, OnInit } from '@angular/core';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgFor, NgIf } from '@angular/common';
import { Tag } from 'primeng/tag';
import { CompaniaTransporteTuristicoModel, GuiaTurismoModel, RepresentanteVentaModel } from '@/legacy/models/siturin';
import { ColumnModel } from '@/legacy/models/core';
import { MessageService } from '@/legacy/services/core';

@Component({
    selector: 'app-operacion-intermediacion-interno',
    templateUrl: './operacion-intermediacion-interno.component.html',
    styleUrls: ['./operacion-intermediacion-interno.component.scss'],
    imports: [Bind, Card, TableModule, PrimeTemplate, NgFor, NgIf, Tag]
})
export class OperacionIntermediacionInternoComponent implements OnInit {
    @Input() representantesVentas: RepresentanteVentaModel[] = [];
    @Input() guiasTurismo: GuiaTurismoModel[] = [];
    @Input() companiasTransporteTuristico: CompaniaTransporteTuristicoModel[] = [];
    columnasCompaniasTransporteTuristicoTabla: ColumnModel[] = this.configurarColumnasCompaniasTransporteTuristicoTabla();
    columnasGuiasTurismoTabla: ColumnModel[] = this.configurarColumnasGuiasTurismoTabla();
    columnasRepresentantesVentasTabla: ColumnModel[] = this.configurarColumnasRepresentantesVentasTabla();
    public messageService = inject(MessageService);
    constructor() {}

    ngOnInit(): void {}

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
}
