import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ColumnModel } from '@models/core';
import { CoreService, MessageService } from '@services/core';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Tag } from 'primeng/tag';
import { CatalogoModel } from '@models/siturin';

interface TransporteTerrestre {
    capacidad: number;
    tipo: CatalogoModel;
}

@Component({
    selector: 'app-transporte',
    templateUrl: './transporte.component.html',
    styleUrls: ['./transporte.component.scss'],
    imports: [Card, TableModule, PrimeTemplate, NgFor, NgIf, Tag, AsyncPipe]
})
export class TransporteComponent implements OnInit {
    @Output() operacionIntermediacionOut: EventEmitter<any> = new EventEmitter<any>();
    @Input() transporteTerrestres: TransporteTerrestre[] = [];
    @Input() esEditable: boolean = false;
    private coreService = inject(CoreService);
    private formBuilder = inject(UntypedFormBuilder);
    public messageService = inject(MessageService);
    formulario: FormGroup = this.nuevoFormulario;
    columnasTransporteTerrestreTabla: ColumnModel[] = this.configurarColumnasTransporteTerrestreTabla();
    cargado$ = this.coreService.loaded$;

    constructor() {
    }

    ngOnInit(): void {
        if (!this.esEditable) {
            this.formulario.disable();
        }

        console.log(this.transporteTerrestres)
        this.transporteTerrestreField.patchValue(this.transporteTerrestres);
    }

    configurarColumnasTransporteTerrestreTabla(): ColumnModel[] {
        return [
            { field: 'tipo', header: 'Tipo' },
            { field: 'capacidad', header: 'Capacidad' },
        ];
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            transporteTerrestres: [[]]
        });
    }

    get transporteTerrestreField() {
        return this.formulario.controls['transporteTerrestres'];
    }
}
