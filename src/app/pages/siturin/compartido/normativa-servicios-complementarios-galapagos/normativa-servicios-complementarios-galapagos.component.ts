import { FormGroup } from '@angular/forms';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { SkeletonComponent } from '../../../../legacy/shared/components/skeleton/skeleton.component';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CategoriaModel, ConfiguracionCategoriaModel, EstablecimientoModel, NormativaModel } from '@/legacy/models/siturin';
import { CoreService } from '@/legacy/services/core';
import { ClasificacionesHttpService, EstablecimientosService, NormativasHttpService, NormativasService } from '@/legacy/services/siturin';
import { NormativaTypeEnum } from '@/legacy/shared/enums';
import { MaximoConfigracionCategoriaPipe } from '@/legacy/shared/pipes/siturin/maximo-configracion-categoria.pipe';

@Component({
    selector: 'app-normativa-servicios-complementarios-galapagos',
    templateUrl: './normativa-servicios-complementarios-galapagos.component.html',
    styleUrls: ['./normativa-servicios-complementarios-galapagos.component.scss'],
    imports: [NgIf, SkeletonComponent, Bind, Card, TableModule, PrimeTemplate, Tag, ToggleSwitch, NgFor, AsyncPipe, MaximoConfigracionCategoriaPipe]
})
export class NormativaServiciosComplementariosGalapagosComponent implements OnInit {
    @Input() actividad: AbstractControl = new FormControl();
    @Input() clasificacion: AbstractControl = new FormControl();
    @Input() modeloId: number = 0;
    @Input() modeloTipo: string = '';
    @Output() normativaRespuestas: EventEmitter<any[]> = new EventEmitter<any[]>();

    private coreService = inject(CoreService);
    private clasificacionesHttpService = inject(ClasificacionesHttpService);
    private establecimientosService = inject(EstablecimientosService);
    private normativasHttpService = inject(NormativasHttpService);
    private formBuilder = inject(FormBuilder);
    private normativasService = inject(NormativasService);

    cargado$ = this.coreService.loaded$;
    normativas: NormativaModel[] = [];
    respuestas: FormArray = this.respuestasForm;
    respuesta = this.respuestaFormulario;
    modelo = this.normativasService.modeloServiciosComplementarios$;
    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
    configuracionCategorias: ConfiguracionCategoriaModel[] = [];
    totalPuntaje: number = 0;
    totalPuntajeObtenido: number = 0;
    totalPuntajeObtenidoCategoria: number = 0;
    categoriaObtenida: CategoriaModel = {};
    preguntasFaltantes: any[] = [];
    flag: boolean = false;

    constructor() {
        this.respuestas.valueChanges.subscribe((value) => {});
    }

    ngOnInit(): void {
        this.modelo.subscribe((value) => {
            if (value.tipo === NormativaTypeEnum.CLASIFICACION) this.obtenerNormativasPorClasificacion(value.id);

            if (value.tipo === NormativaTypeEnum.CATEGORIA) this.obtenerNormativasPorCategoria(value.id);

            this.obtenerConfiguracionCategoriasPorClasificacion();
        });
        // this.obtenerConfiguracionCategoriasPorClasificacion();
    }

    get respuestasForm(): FormArray {
        return this.formBuilder.array([]) as FormArray;
    }

    get respuestaFormulario(): FormGroup {
        return this.formBuilder.group({
            normativa: [{}, Validators.required],
            respuesta: [false, Validators.required],
            cumple: [false, Validators.required]
        });
    }

    calcularNormativaRespuestas() {
        if (this.configuracionCategorias.length === 0) {
            return;
        }
        const normativaRespuestas: any[] = this.respuestas.value;

        this.totalPuntajeObtenido = 0;
        this.totalPuntaje = 0;
        normativaRespuestas.forEach((normativaRespuesta) => {
            if (normativaRespuesta.normativa.puntaje) {
                this.totalPuntaje += parseFloat(normativaRespuesta.normativa.puntaje);

                if (normativaRespuesta.respuesta) {
                    this.totalPuntajeObtenido += parseFloat(normativaRespuesta.normativa.puntaje);
                }
            }
        });

        this.totalPuntajeObtenidoCategoria = this.totalPuntajeObtenido;

        const configuracionCategorias = this.configuracionCategorias.filter(
            (configuracionCategoria: ConfiguracionCategoriaModel) => this.totalPuntajeObtenidoCategoria >= configuracionCategoria.min! && this.totalPuntajeObtenidoCategoria <= configuracionCategoria.max!
        );

        if (configuracionCategorias.length >= 0) this.categoriaObtenida = configuracionCategorias[0].categoria!;
        else this.categoriaObtenida = {};
    }

    obtenerNormativasPorClasificacion(normatiavId: number) {
        this.normativasHttpService.obtenerNormativasPorClasificacion(normatiavId).subscribe((normativas) => {
            this.normativas = normativas;
            this.normativas = this.normativas.filter((normativa) => normativa.esRequisitoAventura === false);
            this.inicializarRespuestas();
        });
    }

    obtenerNormativasPorCategoria(normatiavId: number) {
        this.normativasHttpService.obtenerNormativasPorCategoria(normatiavId).subscribe((normativas) => {
            this.normativas = normativas;
            this.normativas = this.normativas.filter((normativa) => normativa.esRequisitoAventura === false);
            this.inicializarRespuestas();
        });
    }

    obtenerConfiguracionCategoriasPorClasificacion() {
        this.clasificacionesHttpService.obtenerConfiguracionCategoriasPorClasificacion(this.clasificacion.value?.id).subscribe((configuracionCategorias) => {
            this.configuracionCategorias = configuracionCategorias.sort(function (a, b) {
                if (a.categoria?.orden! > b.categoria?.orden!) {
                    return 1;
                }
                if (a.categoria?.orden! < b.categoria?.orden!) {
                    return -1;
                }
                // a must be equal to b
                return 0;
            });
        });
    }

    agregarRespuesta(normativa: NormativaModel, respuesta: boolean) {
        this.respuesta.patchValue({ normativa, respuesta, cumple: respuesta });

        const index = this.respuestas.value.findIndex((respuesta: any) => respuesta.normativa.id === normativa.id);

        this.respuestas.value[index] = this.respuesta.value;

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.normativaRespuestas = this.respuestas.value;
        }

        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

        this.validarMinimoRespuestas();
        this.calcularNormativaRespuestas();
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

        this.validarMinimoRespuestas();
    }

    inicializarRespuestas() {
        this.totalPuntaje = 0;

        this.normativas.forEach((normativa) => {
            if (normativa.puntaje) {
                this.totalPuntaje += parseFloat(String(normativa.puntaje));
            }
            // if (normativa.esPregunta) {
            const respuestaForm = this.respuestaFormulario;
            respuestaForm.patchValue({ normativa, cumple: false, respuesta: false });

            this.respuestas.push(respuestaForm);
            // }
        });
    }

    validarMinimoRespuestas() {
        const normativaRespuestas: any[] = this.respuestas.value;

        let suma = 0;
        let minimo = 0;
        this.preguntasFaltantes = [];

        this.normativas.forEach((normativa) => {
            if (!normativa.esPregunta) {
                minimo = normativa.minimoPreguntas!;
                suma = 0;
                if (parseInt(String(minimo)) > 0) {
                    normativaRespuestas.forEach((normativaRespuesta) => {
                        if (normativa.id === normativaRespuesta.normativa.padre?.id && normativaRespuesta.normativa.esPregunta) {
                            if (normativaRespuesta.respuesta) {
                                suma++;
                            }
                        }
                    });
                }

                if (parseInt(String(suma)) < parseInt(String(minimo))) {
                    this.preguntasFaltantes.push(normativa);
                }
            }
        });

        // if (!this.categoriaObtenida?.id) {
        //   this.preguntasFaltantes.push({
        //     nombre: 'No es suficiente para aplicar por una categoría de turismo.'
        //   });
        // }

        if (this.preguntasFaltantes.length === 0) {
            this.normativaRespuestas.emit(this.respuestas.value);
        } else {
            this.normativaRespuestas.emit([]);
        }
    }

    protected readonly environment = environment;
}
