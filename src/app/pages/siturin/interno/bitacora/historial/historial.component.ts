import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Bind } from 'primeng/bind';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { FormControl } from '@angular/forms';
import { AsignacionModel, InspeccionModel } from '@/legacy/models/siturin';
import { ColumnModel } from '@/legacy/models/core';
import { AsignacionesHttpService, InspeccionesHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';

@Component({
    selector: 'app-historial',
    templateUrl: './historial.component.html',
    styleUrls: ['./historial.component.scss'],
    imports: [Bind, TableModule, PrimeTemplate, NgFor, NgIf, NgSwitch, NgSwitchCase, Tag, NgSwitchDefault, AsyncPipe, DatePipe]
})
export class HistorialComponent implements OnInit {
    @Input() tramiteId: FormControl = new FormControl<number>(0);
    @Output() esTramiteSeleccionadoOut: EventEmitter<boolean> = new EventEmitter<boolean>(true);

    private asignacionesHttpService = inject(AsignacionesHttpService);
    private coreService = inject(CoreService);
    private inspeccionesHttpService = inject(InspeccionesHttpService);
    public messageService = inject(MessageService);
    asignaciones: AsignacionModel[] = [];
    inspecciones: InspeccionModel[] = [];
    columnasTablaAsignaciones: ColumnModel[] = this.configurarColumnasTablaAsignaciones();
    columnasTablaInspecciones: ColumnModel[] = this.configurarColumnasTablaInspecciones();
    cargado$ = this.coreService.loaded$;

    constructor() {}

    ngOnInit(): void {
        this.obtenerAsignacionesPorTramite();
        this.obtenerInspeccionesPorTramite();

        this.tramiteId.valueChanges.subscribe((value) => {
            this.obtenerAsignacionesPorTramite();
            this.obtenerInspeccionesPorTramite();
        });
    }

    obtenerAsignacionesPorTramite() {
        this.asignacionesHttpService.obtenerAsignacionesPorTramiteTodos(this.tramiteId.value).subscribe((asignaciones) => {
            this.asignaciones = asignaciones;
        });
    }

    obtenerInspeccionesPorTramite() {
        this.inspeccionesHttpService.obtenerInspeccionesPorTramiteTodos(this.tramiteId.value).subscribe((inspecciones) => {
            this.inspecciones = inspecciones;
        });
    }

    configurarColumnasTablaAsignaciones() {
        return [
            { field: 'fecha', header: 'Fecha Asignación' },
            { field: 'usuarioInterno', header: 'Bandeja' },
            { field: 'observaciones', header: 'Observaciones' }
        ];
    }

    configurarColumnasTablaInspecciones() {
        return [
            { field: 'estadoFecha', header: 'Estado' },
            { field: 'fechaCreacion', header: 'Fecha Creación' },
            { field: 'fechaInspeccion', header: 'Fecha Inspección' },
            { field: 'usuarioInterno', header: 'Bandeja' },
            { field: 'observaciones', header: 'Observaciones' }
        ];
    }
}
