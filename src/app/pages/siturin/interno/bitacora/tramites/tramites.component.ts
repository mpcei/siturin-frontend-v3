import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ColumnModel } from '@models/core';
import { TramiteModel } from '@models/siturin';
import { CoreService, MessageService } from '@services/core';
import { CatastrosHttpService, TramitesHttpService } from '@services/siturin';
import { ActividadCodigoEnum } from '@shared/enums';
import { Bind } from 'primeng/bind';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, DatePipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { HistorialComponent } from '../historial/historial.component';

@Component({
    selector: 'app-tramites',
    templateUrl: './tramites.component.html',
    styleUrls: ['./tramites.component.scss'],
    imports: [Bind, ButtonDirective, Ripple, TableModule, PrimeTemplate, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, Tooltip, HistorialComponent, DatePipe]
})
export class TramitesComponent implements OnInit {
    @Input() establecimientoId: number = 0;
    @Output() esEstablecimientoSeleccionadoOut: EventEmitter<boolean> = new EventEmitter<boolean>(true);
    private coreService = inject(CoreService);
    private tramitesHttpService = inject(TramitesHttpService);
    public messageService = inject(MessageService);
    private catastrosHttpService = inject(CatastrosHttpService);

    tramites: TramiteModel[] = [];
    columnasTramitesTabla: ColumnModel[] = [];
    cargando: boolean = false;
    tramiteId: FormControl = new FormControl<number>(0);
    esTramiteSeleccionado: boolean = false;

    constructor() {}

    ngOnInit(): void {
        this.obtenerTodosTramitesPorEstablecimiento(this.establecimientoId);
        this.configurarColumnasTramitesTabla();
    }

    descargarDocumento(tramiteActual: TramiteModel) {
        const catastro = tramiteActual?.catastro;
        if (catastro) {
            this.cargando = true;
            this.catastrosHttpService.obtenerDocumentoTodos(catastro.id!, tramiteActual.tipo?.codigo!).subscribe(
                (documento) => {
                    this.coreService.descargarDocumentoPDF(documento, tramiteActual.tipo?.codigo + '_' + catastro.numeroRegistro);
                    this.cargando = false;
                },
                (error) => (this.cargando = false)
            );

            if (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS && tramiteActual.tipo?.codigo === 'registro') {
                this.catastrosHttpService.obtenerDocumentoTodos(catastro.id!, 'tarifario_rack').subscribe(
                    (documento) => {
                        this.coreService.descargarDocumentoPDF(documento, 'tarifario_rack_' + catastro.numeroRegistro);
                        this.cargando = false;
                    },
                    (error) => (this.cargando = false)
                );
            }
        }
    }

    obtenerTodosTramitesPorEstablecimiento(establecimientoId: number) {
        this.tramitesHttpService.obtenerTodosTramitesPorEstablecimiento(establecimientoId).subscribe((tramites) => {
            this.tramites = tramites;
        });
    }

    configurarColumnasTramitesTabla() {
        this.columnasTramitesTabla = [
            { field: 'actividad', header: 'Actividad' },
            { field: 'numeroRegistro', header: 'Número de Registro' },
            { field: 'fecha', header: 'Fecha Trámite' },
            { field: 'tipo', header: 'Tipo de Trámite' },
            { field: 'catastro', header: 'Estado Catastro' }
        ];
    }

    mostrarHistorial(tramite: TramiteModel) {
        this.esTramiteSeleccionado = false;
        setTimeout(function () {}, 300);
        this.esTramiteSeleccionado = true;
        this.tramiteId.setValue(tramite.id);
    }
}
