import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Divider } from 'primeng/divider';
import { Dialog } from 'primeng/dialog';
import { LabelDirective } from '../../../../../../legacy/shared/directives/label.directive';
import { ErrorMessageDirective } from '../../../../../../legacy/shared/directives/error-message.directive';
import { ProgressBarComponent } from '../../../../../../legacy/shared/components/progress-bar/progress-bar.component';

import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { CatalogoModel, EstablecimientoModel, HabitacionModel, ModalidadTurismoAventuraModel, TramiteModel } from '@/legacy/models/siturin';
import { ColumnModel } from '@/legacy/models/core';
import { CatalogosSiturinService, CatastrosHttpService, CategoriasHttpService, ClasificacionesHttpService, EstablecimientosService, TramitesHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { TipoHabitacionCodigoEnum, TramiteTiposEnum } from '@/legacy/shared/enums';
@Component({
    selector: 'app-inmuebles-habitacionales',
    templateUrl: './inmuebles-habitacionales.component.html',
    styleUrls: ['./inmuebles-habitacionales.component.scss'],
    imports: [Bind, Panel, NgFor, TableModule, PrimeTemplate, NgIf, ButtonDirective, Ripple, Divider, ReactiveFormsModule, Dialog, LabelDirective, ErrorMessageDirective, ProgressBarComponent, AsyncPipe, InputNumber, Select]
})
export class InmueblesHabitacionalesComponent implements OnInit {
    @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();
    @Input() actividad: AbstractControl = new FormControl();
    @Input() clasificacion: AbstractControl = new FormControl();
    @Input() categoria: AbstractControl = new FormControl();

    private catastrosHttpService = inject(CatastrosHttpService);
    private formBuilder = inject(FormBuilder);
    private catalogosSiturinService = inject(CatalogosSiturinService);
    private categoriasHttpService = inject(CategoriasHttpService);
    private clasificacionesHttpService = inject(ClasificacionesHttpService);
    private coreService = inject(CoreService);
    private establecimientosService = inject(EstablecimientosService);
    public messageService = inject(MessageService);
    private tramitesHttpService = inject(TramitesHttpService);
    private router = inject(Router);

    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
    columnasTipoHabitacionTabla: ColumnModel[] = this.configurarColumnasTipoHabitacionTablas();
    columnasServiciosComplementariosTabla: ColumnModel[] = this.configurarColumnasServiciosComplementariosTabla();
    clasificaciones: CatalogoModel[] = [];
    formulario: FormGroup = this.nuevoFormulario;
    tipoHabitaciones: CatalogoModel[] = [];
    modalidadesTurismoAventura: ModalidadTurismoAventuraModel[] = [];
    modalidadesTurismoAventuraAgua: CatalogoModel[] = [];
    modalidadesTurismoAventuraAire: CatalogoModel[] = [];
    modalidadesTurismoAventuraTierra: CatalogoModel[] = [];
    formularioHabitacion: FormGroup = this.nuevoFormularioHabitacion;
    formularioServicioComplementario: FormGroup = this.nuevoFormularioServicioComplementario;
    habitacion = this.nuevoFormularioHabitacion;
    cargado$ = this.coreService.loaded$;
    totalHabitaciones: number = 0;
    totalPlazas: number = 0;
    mostrarDialogoNuevaHabitacion: boolean = false;
    mostrarDialogoNuevoServicioComplementario: boolean = false;
    formularioValido: boolean = false;
    normativaRespuestas: any[] = [];
    indexServicioComplementario: number = -1;
    dialogoCrearTramite: boolean = false;
    camposInvalidos: string[] = [];
    esCambioUbicacion: boolean = false;

    constructor() {
        this.establecimientoSeleccionado = this.establecimientosService.establecimiento;

        if (sessionStorage.getItem('esCambioUbicacion') == 'true') {
            // this.usoSuelosField.setValidators(Validators.requiredTrue);
            // this.esCambioUbicacion = true;
        } else {
            // this.usoSuelosField.setValue(false);
            // this.usoSuelosField.setValidators(null);
        }

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.tramiteAlojamiento = {};
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }

        this.formulario.valueChanges.subscribe(() => {
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        });

        this.habitacionTipoField.valueChanges.subscribe((value) => {
            this.habitacionHabitacionesField.setValue(0);
            this.habitacionCamasField.setValue(0);
            this.habitacionPlazasField.setValue(0);
        });

        this.habitacionHabitacionesField.valueChanges.subscribe((value) => {
            if (this.habitacionTipoField.value?.codigo === TipoHabitacionCodigoEnum.INDIVIDUAL_SIMPLE) {
                this.calcularHabitacionSimple(value);
            }
            if (this.habitacionTipoField.value?.codigo === TipoHabitacionCodigoEnum.DOBLE) {
                this.calcularHabitacionDoble(value, this.habitacionCamasField.value);
            }

            if (this.habitacionTipoField.value?.codigo === TipoHabitacionCodigoEnum.TRIPLE) {
                this.calcularHabitacionTriple(value, this.habitacionCamasField.value);
            }
            if (this.habitacionTipoField.value?.codigo === TipoHabitacionCodigoEnum.CUADRUPLE) {
                this.calcularHabitacionCuadruple(value, this.habitacionCamasField.value);
            }
        });
    }

    ngOnInit(): void {
        if (this.categoria.value?.id) {
            this.obtenerTipoHabitaciones(this.categoria.value?.id);
        }
        this.categoria.valueChanges.subscribe((value) => {
            if (value) {
                this.obtenerTipoHabitaciones(value?.id);
            }
        });
    }
    calcularHabitacionSimple(habitaciones: number) {
        this.habitacionCamasField.setValue(habitaciones);
        this.habitacionPlazasField.setValue(habitaciones);
    }

    calcularHabitacionDoble(habitaciones: number, camas: number) {
        this.habitacionPlazasField.setValue(habitaciones * 2);
    }

    calcularHabitacionTriple(habitaciones: number, camas: number) {
        this.habitacionPlazasField.setValue(habitaciones * 3);
    }

    calcularHabitacionCuadruple(habitaciones: number, camas: number) {
        this.habitacionPlazasField.setValue(habitaciones * 4);
    }

    configurarColumnasServiciosComplementariosTabla(): ColumnModel[] {
        return [
            { field: 'clasificacion', header: 'Clasificación' },
            { field: 'capacidad', header: 'Capacidad en número de personas' }
        ];
    }

    configurarColumnasTipoHabitacionTablas(): ColumnModel[] {
        return [
            { field: 'tipoHabitacion', header: 'Tipo' },
            { field: 'habitaciones', header: 'Habitaciones' },
            { field: 'camas', header: 'Camas' },
            { field: 'plazas', header: 'Plazas' }
        ];
    }

    // llenarNormativaRespuestas(normativaRespuestas: any[]) {
    //   this.normativaRespuestas = normativaRespuestas;
    //   if (this.establecimientoSeleccionado.tramiteActual) {
    //     this.normativaRespuestasField.setValue(normativaRespuestas);
    //     this.establecimientoSeleccionado.tramiteActual.normativaRespuestas = normativaRespuestas;
    //     this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    //   }
    //
    //   this.validarFormulario();
    // }

    get respuestasFormulario() {
        return this.formBuilder.array([]);
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            habitaciones: [[]],
            tieneServiciosComplementarios: [false],
            tieneModalidadesTurismoAventura: [false],
            modalidadesTurismoAventura: [[]],
            serviciosComplementarios: [[]],
            modalidadesTurismoAventuraAgua: [[]],
            modalidadesTurismoAventuraAire: [[]],
            modalidadesTurismoAventuraTierra: [[]],
            usoSuelos: [false]
        });
    }

    get nuevoFormularioServicioComplementario() {
        return this.formBuilder.group({
            clasificacion: [null, [Validators.required]],
            capacidad: [1, [Validators.required]]
        });
    }

    get nuevoFormularioHabitacion() {
        return this.formBuilder.group({
            tipoHabitacion: [null, [Validators.required]],
            tramite: [null, []],
            camas: [0, [Validators.required, Validators.min(1)]],
            habitaciones: [0, [Validators.required, Validators.min(1)]],
            plazas: [0, [Validators.required, Validators.min(1)]]
        });
    }

    guardarTramite() {
        if (this.validarFormulario()) {
            // let text = `Recuerde que, una vez enviada la información, esta será verificada mediante inspección.”`;
            let text = ``;

            if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION && sessionStorage.getItem('esCambioUbicacion') == 'false') {
                text = ``;
            }
            this.messageService.questionCustom(`¿Está seguro de gestionar el trámite “${this.establecimientoSeleccionado.tramiteActual?.tipo?.nombre}” ante el ${environment.MINISTERIO}?`, text, 'Si, Gestionar').then((result) => {
                if (result.isConfirmed) {
                    this.dialogoCrearTramite = true;
                    this.tramitesHttpService.guardarTramiteAlojamientoContinente(this.establecimientosService.establecimiento).subscribe(
                        (tramiteActual) => {
                            this.dialogoCrearTramite = false;
                            this.descargarDocumento(tramiteActual);
                            this.router.navigate(['/siturin/externo/establecimientos']);
                        },
                        (error) => (this.dialogoCrearTramite = false)
                    );
                }
            });
        } else {
            this.formulario.markAllAsTouched();
            this.messageService.getErrorsCustom('Por favor complete toda la información', '');
        }
    }

    descargarDocumento(tramiteActual: TramiteModel) {
        const catastro = tramiteActual.catastro;
        if (catastro && tramiteActual) {
            this.catastrosHttpService.obtenerDocumentoUsuarioExterno(catastro.id!, tramiteActual.tipo?.codigo!).subscribe((documento) => {
                this.coreService.descargarDocumentoPDF(documento, tramiteActual.tipo?.codigo + '_' + catastro.numeroRegistro);
            });
        }
    }

    validarFormulario(): boolean {
        this.camposInvalidos = [];

        if (!this.validarHabitaciones()) {
            this.camposInvalidos.push('Habitaciones');
        }

        return this.formulario.valid && this.validarHabitaciones();
    }

    validarHabitaciones(): boolean {
        let valido = true;
        if (this.clasificacion.value?.minHabitaciones && this.totalHabitaciones < this.clasificacion.value?.minHabitaciones) {
            valido = false;
        }

        if (this.clasificacion.value?.maxHabitaciones && this.totalHabitaciones > this.clasificacion.value?.maxHabitaciones) {
            valido = false;
        }

        if (this.clasificacion.value?.minPlazas && this.totalPlazas < this.clasificacion.value?.minPlazas) {
            valido = false;
        }

        if (this.clasificacion.value?.maxPlazas && this.totalPlazas > this.clasificacion.value?.maxPlazas) {
            valido = false;
        }

        return valido;
    }

    agregarHabitacion() {
        if (this.formularioHabitacion.valid) {
            const indexHabitacion = this.habitacionesField.value.findIndex((element: HabitacionModel) => element.tipoHabitacion?.id === this.habitacionTipoField.value?.id);

            if (indexHabitacion > -1) {
                this.messageService.getInfoCustom('Ya existe el tipo de habitación', 'La habitación fue actualizada.');
                this.habitacionesField.value[indexHabitacion] = this.formularioHabitacion.value;
            } else {
                this.habitacionesField.value.push(this.formularioHabitacion.value);
            }

            if (this.establecimientoSeleccionado.tramiteActual) {
                this.establecimientoSeleccionado.tramiteActual.habitaciones = this.habitacionesField.value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }

            this.totalHabitaciones = 0;
            this.totalPlazas = 0;
            this.habitacionesField.value.forEach((habitacion: HabitacionModel) => {
                this.totalHabitaciones += habitacion.habitaciones!;
                this.totalPlazas += habitacion.plazas!;
            });
            this.formularioHabitacion.reset();
            this.mostrarDialogoNuevaHabitacion = false;
        } else {
            this.formularioHabitacion.markAllAsTouched();
        }
    }

    editarHabitacion(habitacion: HabitacionModel) {
        this.mostrarDialogoNuevaHabitacion = true;
        this.formularioHabitacion.patchValue(habitacion);
    }

    eliminarHabitacion(index: number) {
        this.habitacionesField.value.splice(index, 1);

        this.totalHabitaciones = 0;
        this.totalPlazas = 0;
        this.habitacionesField.value.forEach((habitacion: HabitacionModel) => {
            this.totalHabitaciones += habitacion.habitaciones!;
            this.totalPlazas += habitacion.plazas!;
        });

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.habitaciones = this.habitacionesField.value;
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }
    }

    obtenerTipoHabitaciones(categoriaId: number) {
        this.categoriasHttpService.obtenerTipoHabitacionesPorCategoria(categoriaId).subscribe((tipoHabitaciones) => {
            this.tipoHabitaciones = tipoHabitaciones;
        });
    }

    get habitacionesField() {
        return this.formulario.controls['habitaciones'];
    }

    get habitacionTipoField() {
        return this.formularioHabitacion.controls['tipoHabitacion'];
    }

    get habitacionCamasField() {
        return this.formularioHabitacion.controls['camas'];
    }

    get habitacionHabitacionesField() {
        return this.formularioHabitacion.controls['habitaciones'];
    }

    get habitacionPlazasField() {
        return this.formularioHabitacion.controls['plazas'];
    }

    get modalidadesTurismoAventuraField() {
        return this.formulario.controls['modalidadesTurismoAventura'];
    }

    get modalidadesTurismoAventuraAguaField() {
        return this.formulario.controls['modalidadesTurismoAventuraAgua'];
    }

    get modalidadesTurismoAventuraAireField() {
        return this.formulario.controls['modalidadesTurismoAventuraAire'];
    }

    get modalidadesTurismoAventuraTierraField() {
        return this.formulario.controls['modalidadesTurismoAventuraTierra'];
    }

    get tieneModalidadesTurismoAventuraField() {
        return this.formulario.controls['tieneModalidadesTurismoAventura'];
    }

    get clasificacionField() {
        return this.formularioServicioComplementario.controls['clasificacion'];
    }

    get usoSuelosField(): AbstractControl {
        return this.formulario.controls['usoSuelos'];
    }
}
