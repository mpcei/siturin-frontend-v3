import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NgIf, AsyncPipe } from '@angular/common';y
import { SkeletonComponent } from '../../../../legacy/shared/components/skeleton/skeleton.component';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CoreService } from '@/legacy/services/core';
import { EstablecimientosService, NormativasHttpService, NormativasService } from '@/legacy/services/siturin';
import { EstablecimientoModel, NormativaModel } from '@/legacy/models/siturin';
import { NormativaTypeEnum } from '@/legacy/shared/enums';

@Component({
    selector: 'app-normativa-modalidad-turismo-aventura-ctc',
    templateUrl: './normativa-modalidad-turismo-aventura-ctc.component.html',
    styleUrls: ['./normativa-modalidad-turismo-aventura-ctc.component.scss'],
    imports: [NgIf, SkeletonComponent, Bind, Card, TableModule, PrimeTemplate, ToggleSwitch, AsyncPipe]
})
export class NormativaModalidadTurismoAventuraCtcComponent implements OnInit {
    @Output() normativaRespuestas: EventEmitter<any[]> = new EventEmitter<any[]>();

    private coreService = inject(CoreService);
    private establecimientosService = inject(EstablecimientosService);
    private normativasHttpService = inject(NormativasHttpService);
    private formBuilder = inject(FormBuilder);
    private normativasService = inject(NormativasService);

    cargado$ = this.coreService.loaded$;
    normativas: NormativaModel[] = [];
    respuestas: FormArray = this.respuestasForm;
    respuesta = this.respuestaFormulario;
    modelo = this.normativasService.modelo$;
    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;

    constructor() {
        this.respuestas.valueChanges.subscribe((value) => {});

        this.modelo.subscribe((value) => {
            if (value.tipo === NormativaTypeEnum.CLASIFICACION) this.obtenerNormativasPorClasificacion(value.id);

            if (value.tipo === NormativaTypeEnum.CATEGORIA) this.obtenerNormativasPorCategoria(value.id);
        });
    }

    ngOnInit(): void {}

    get respuestasForm(): FormArray {
        return this.formBuilder.array([]) as FormArray;
    }

    get respuestaFormulario() {
        return this.formBuilder.group({
            normativa: [{}, Validators.required],
            respuesta: [false, Validators.required],
            cumple: [false, Validators.required]
        });
    }

    validarNormativaRespuestas() {
        const normativaRespuestas: any[] = this.respuestas.value;

        const validacion = normativaRespuestas.every((normativaRespuesta) => {
            if (normativaRespuesta.normativa.esObligatorio) {
                return normativaRespuesta.respuesta;
            } else {
                return true;
            }
        });

        if (validacion) {
            this.normativaRespuestas.emit(this.respuestas.value);
        } else {
            this.normativaRespuestas.emit([]);
        }
    }

    obtenerNormativasPorClasificacion(normatiavId: number) {
        this.normativasHttpService.obtenerNormativasPorClasificacion(normatiavId).subscribe((normativas) => {
            this.normativas = normativas;
            this.normativas = this.normativas.filter((normativa) => normativa.esRequisitoAventura);
            this.inicializarRespuestas();
        });
    }

    obtenerNormativasPorCategoria(normatiavId: number) {
        this.normativasHttpService.obtenerNormativasPorCategoria(normatiavId).subscribe((normativas) => {
            this.normativas = normativas;
            this.normativas = this.normativas.filter((normativa) => normativa.esRequisitoAventura);
            this.inicializarRespuestas();
        });
    }

    agregarRespuesta(normativa: NormativaModel, respuesta: boolean) {
        this.respuesta.patchValue({ normativa, respuesta, cumple: respuesta });

        const index = this.respuestas.value.findIndex((respuesta: any) => respuesta.normativa.id === normativa.id);

        this.respuestas.value[index] = this.respuesta.value;

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.normativaRespuestasModalidadesTurismoAventura = this.respuestas.value;
        }

        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

        this.validarNormativaRespuestas();
    }

    agregarTodasRespuesta(event: any) {
        const respuestas: any[] = this.respuestas.value;

        for (let i = 0; i < respuestas.length; i++) {
            this.respuestas.value[i] = {
                normativa: respuestas[i].normativa,
                respuesta: event.checked,
                esObligatorio: respuestas[i].esObligatorio
            };
        }

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.normativaRespuestas = this.respuestas.value;
        }

        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

        this.validarNormativaRespuestas();
    }

    inicializarRespuestas() {
        this.normativas.forEach((normativa) => {
            const respuestaForm = this.respuestaFormulario;
            respuestaForm.patchValue({ normativa, cumple: false, respuesta: false });
            this.respuestas.push(respuestaForm);
        });
    }
}
