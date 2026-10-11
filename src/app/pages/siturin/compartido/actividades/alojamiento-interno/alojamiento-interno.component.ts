import { Component, inject, Input, OnInit } from '@angular/core';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgFor } from '@angular/common';
import { HabitacionModel, ServicioComplementarioModel, TramiteAlojamientoModel } from '@/legacy/models/siturin';
import { ColumnModel } from '@/legacy/models/core';
import { MessageService } from '@/legacy/services/core';

@Component({
    selector: 'app-alojamiento-interno',
    templateUrl: './alojamiento-interno.component.html',
    styleUrls: ['./alojamiento-interno.component.scss'],
    imports: [Bind, Card, TableModule, PrimeTemplate, NgFor]
})
export class AlojamientoInternoComponent implements OnInit {
    @Input() tramiteAlojamiento: TramiteAlojamientoModel = {};
    @Input() habitaciones: HabitacionModel[] = [];
    @Input() serviciosComplementarios: ServicioComplementarioModel[] = [];
    columnasTipoHabitacionTabla: ColumnModel[] = this.configurarColumnasTipoHabitacionTablas();
    columnasServiciosComplementariosTabla: ColumnModel[] = this.configurarColumnasServiciosComplementariosTabla();
    public messageService = inject(MessageService);
    constructor() {}

    ngOnInit(): void {}

    configurarColumnasTipoHabitacionTablas(): ColumnModel[] {
        return [
            { field: 'tipoHabitacion', header: 'Tipo' },
            { field: 'habitaciones', header: 'Habitaciones' },
            { field: 'camas', header: 'Camas' },
            { field: 'plazas', header: 'Plazas' }
        ];
    }

    configurarColumnasServiciosComplementariosTabla(): ColumnModel[] {
        return [
            { field: 'clasificacion', header: 'Clasificación' },
            { field: 'capacidad', header: 'Capacidad en número de personas' }
        ];
    }
}
