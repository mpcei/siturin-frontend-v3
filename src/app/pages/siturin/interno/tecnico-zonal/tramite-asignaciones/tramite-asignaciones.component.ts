import { Component, Input, OnInit,inject } from '@angular/core';
import { AsignacionModel } from '@models/siturin';
import { ColumnModel } from '@models/core';
import { AsignacionesHttpService } from '@services/siturin';
import { CoreService, MessageService } from '@services/core';
import { Bind } from 'primeng/bind';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-tramite-asignaciones',
    templateUrl: './tramite-asignaciones.component.html',
    styleUrls: ['./tramite-asignaciones.component.scss'],
    imports: [Bind, TableModule, PrimeTemplate, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe]
})
export class TramiteAsignacionesComponent implements OnInit {
    @Input() tramiteId: number = 0;
    private asignacionesHttpService = inject(AsignacionesHttpService);
    private coreService = inject(CoreService);
    public messageService = inject(MessageService);
    cargado$ = this.coreService.loaded$;
    columnasTabla: ColumnModel[] = this.configurarColumnasTabla();
    asignaciones: AsignacionModel[] = [];

    constructor() {}

    ngOnInit(): void {
        this.obtenerAsignacionesPorTramite();
    }

    configurarColumnasTabla() {
        return [
            { field: 'fecha', header: 'Fecha' },
            { field: 'tramite', header: 'Descripción' },
            { field: 'usuarioInterno', header: 'Funcionario' },
            { field: 'observaciones', header: 'Observaciones' }
        ];
    }

    obtenerAsignacionesPorTramite() {
        this.asignacionesHttpService.obtenerAsignacionesPorTramite(this.tramiteId).subscribe((asignaciones) => {
            this.asignaciones = asignaciones;
        });
    }
}
