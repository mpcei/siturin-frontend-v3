import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { format } from 'date-fns';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Panel } from 'primeng/panel';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { DatePicker } from 'primeng/datepicker';
import { InputText } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { MultiSelect } from 'primeng/multiselect';
import { NormativaComponent } from '../../../compartido/normativa/normativa.component';
import { Dialog } from 'primeng/dialog';
import { NormativaServiciosComplementariosGalapagosComponent } from '../../../compartido/normativa-servicios-complementarios-galapagos/normativa-servicios-complementarios-galapagos.component';
import { ProgressBarComponent } from '../../../../../legacy/shared/components/progress-bar/progress-bar.component';

import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { CatalogoModel, ClasificacionModel, EstablecimientoModel, HabitacionModel, ModalidadTurismoAventuraModel, ServicioComplementarioModel, TramiteModel } from '@/legacy/models/siturin';
import { ColumnModel } from '@/legacy/models/core';
import { CatalogosSiturinService, CatastrosHttpService, CategoriasHttpService, ClasificacionesHttpService, EstablecimientosService, NormativasService, TramitesHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { ActividadCodigoEnum, CatalogoSiturinTipoEnum, ClasificacionCodigoEnum, NormativaTypeEnum, TipoHabitacionCodigoEnum, TramiteTiposEnum } from '@/legacy/shared/enums';
@Component({
    selector: 'app-normativa-alojamiento-galapagos',
    templateUrl: './normativa-alojamiento-galapagos.component.html',
    styleUrls: ['./normativa-alojamiento-galapagos.component.scss'],
    imports: [
        Bind,
        Divider,
        NgIf,
        Panel,
        ReactiveFormsModule,
        LabelDirective,
        ToggleSwitch,
        ErrorMessageDirective,
        DatePicker,
        InputText,
        NgFor,
        TableModule,
        PrimeTemplate,
        ButtonDirective,
        Ripple,
        MultiSelect,
        NormativaComponent,
        Dialog,
        NormativaServiciosComplementariosGalapagosComponent,
        ProgressBarComponent,
        AsyncPipe,
        InputNumber,
        Select
    ]
})
export class NormativaAlojamientoGalapagosComponent implements OnInit {
    @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();
    @Input() actividad: AbstractControl = new FormControl();
    @Input() clasificacion: AbstractControl = new FormControl();
    @Input() categoria: AbstractControl = new FormControl();

    private catastrosHttpService = inject(CatastrosHttpService);
    private formBuilder = inject(UntypedFormBuilder);
    private catalogosSiturinService = inject(CatalogosSiturinService);
    private categoriasHttpService = inject(CategoriasHttpService);
    private clasificacionesHttpService = inject(ClasificacionesHttpService);
    private coreService = inject(CoreService);
    private establecimientosService = inject(EstablecimientosService);
    public messageService = inject(MessageService);
    private normativasService = inject(NormativasService);
    private tramitesHttpService = inject(TramitesHttpService);
    private router = inject(Router);

    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
    columnasTipoHabitacionTabla: ColumnModel[] = this.configurarColumnasTipoHabitacionTablas();
    columnasServiciosComplementariosTabla: ColumnModel[] = this.configurarColumnasServiciosComplementariosTabla();
    clasificaciones: ClasificacionModel[] = [];
    formulario: FormGroup = this.nuevoFormulario;
    tipoHabitaciones: CatalogoModel[] = [];
    tipoHabitacionesClon: CatalogoModel[] = [];
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
    normativaAlimentosBebidasRespuestas: any[] = [];
    indexServicioComplementario: number = -1;
    dialogoCrearTramite: boolean = false;
    camposInvalidos: string[] = [];
    indiceHabitacion: number = -1;
    certificadoInactivacionControl: FormControl = new FormControl<any>([null], [Validators.required]);
    codigoInactivacionControl: FormControl = new FormControl<any>([null], [Validators.required]);
    fechaInactivacionControl: FormControl = new FormControl<any>([new Date()], [Validators.required]);
    esCambioUbicacion: boolean = false;

    constructor() {}

    ngOnInit(): void {
        if (sessionStorage.getItem('esCambioUbicacion') == 'true') {
            this.usoSuelosField.setValidators(Validators.requiredTrue);
            this.esCambioUbicacion = true;
        } else {
            this.usoSuelosField.setValue(false);
            this.usoSuelosField.setValidators(null);
        }

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.tramiteAlojamiento = {};

            if (this.establecimientoSeleccionado.tramiteActual.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION || this.establecimientoSeleccionado.tramiteActual.tipo?.codigo === TramiteTiposEnum.REINGRESO) {
                this.establecimientoSeleccionado.tramiteActual.habitaciones = [];
            }
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }

        this.usoSuelosField.patchValue(this.establecimientoSeleccionado.tramiteActual?.usoSuelos);

        this.establecimientoSeleccionado.tramiteActual?.habitaciones?.forEach((habitacion) => {
            this.habitacionesField.value.push(habitacion);
            this.totalHabitaciones += habitacion.habitaciones!;
            this.totalPlazas += habitacion.plazas!;
        });

        this.capturarValoresCamposFormulario();

        this.formulario.valueChanges.subscribe(() => {
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        });

        if (this.categoria.value?.id) {
            this.obtenerTipoHabitaciones(this.categoria.value?.id);
        }

        this.categoria.valueChanges.subscribe((value) => {
            if (value) {
                this.obtenerTipoHabitaciones(value?.id);
            }
        });

        this.clasificacionField.valueChanges.subscribe((value) => {
            if (value) {
                this.normativasService.setModeloServiciosComplementarios(value.id, NormativaTypeEnum.CLASIFICACION);
            }
        });
    }

    capturarValoresCamposFormulario() {
        this.usoSuelosField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.usoSuelos = value;
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

        this.tieneServiciosComplementariosField.valueChanges.subscribe((value) => {
            if (value) {
                this.obtenerClasificaciones();
            }

            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.tieneServiciosComplementarios = value;

            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        });

        this.tieneModalidadesTurismoAventuraField.valueChanges.subscribe((value) => {
            if (value) {
                this.obtenerModalidadesTurismoAventura();
            }

            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.tieneModalidadesTurismoAventura = value;

            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        });

        this.modalidadesTurismoAventuraAguaField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventura = [];
            this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(this.modalidadesTurismoAventuraAireField.value, this.modalidadesTurismoAventuraTierraField.value);

            if (this.establecimientoSeleccionado.tramiteActual) {
                this.establecimientoSeleccionado.tramiteActual.modalidadesTurismoAventura = this.modalidadesTurismoAventura;
            }

            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

            this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);

            this.validarFormulario();
        });

        this.modalidadesTurismoAventuraAireField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventura = [];
            this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(this.modalidadesTurismoAventuraAireField.value, this.modalidadesTurismoAventuraTierraField.value);

            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.modalidadesTurismoAventura = this.modalidadesTurismoAventura;

            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

            this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);

            this.validarFormulario();
        });

        this.modalidadesTurismoAventuraTierraField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventura = [];
            this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(this.modalidadesTurismoAventuraAireField.value, this.modalidadesTurismoAventuraTierraField.value);

            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.modalidadesTurismoAventura = this.modalidadesTurismoAventura;

            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

            this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);

            this.validarFormulario();
        });

        if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REGISTRO && this.clasificacion.value.codigo === ClasificacionCodigoEnum.CASA_HUESPEDES) {
            this.certificadoInactivacionControl.setValidators(Validators.required);
        } else {
            this.certificadoInactivacionControl.setValidators(null);
        }
        this.certificadoInactivacionControl.updateValueAndValidity();
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
            { field: 'habitaciones', header: 'Habitaciones / Tiendas de Campaña' },
            { field: 'camas', header: 'Camas' },
            { field: 'plazas', header: 'Plazas' }
        ];
    }

    cargarArchivoCertificadoInactivacion(event: any) {
        if (event.files.length) {
            this.certificadoInactivacionControl.patchValue(event.files[0]);
            this.certificadoInactivacionControl.updateValueAndValidity();
        }
    }

    removerArchivoCertificadoInactivacion() {
        this.certificadoInactivacionControl.setValue(null);
    }

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
            usoSuelos: [false, [Validators.requiredTrue]]
        });
    }

    get nuevoFormularioServicioComplementario() {
        return this.formBuilder.group({
            clasificacion: [null, [Validators.required]],
            capacidad: [1, [Validators.required]],
            normativaRespuestas: [[], [Validators.required]]
        });
    }

    get nuevoFormularioHabitacion() {
        return this.formBuilder.group({
            tipoHabitacion: [null, [Validators.required]],
            tramite: [null, []],
            camas: [0, [Validators.required, Validators.min(1)]],
            habitaciones: [0, [Validators.required, Validators.min(1)]],
            plazas: [0, [Validators.required, Validators.min(1)]],
            habitacionTarifa: this.nuevoFormularioHabitacionTarifa,
            habitacionTarifas: []
        });
    }

    get nuevoFormularioHabitacionTarifa() {
        return this.formBuilder.group({
            habitacionTemporadaAlta: [null, [Validators.required]],
            habitacionTemporadaBaja: [null, [Validators.required]],
            personaTemporadaBaja: [null, [Validators.required]],
            personaTemporadaAlta: [null, [Validators.required]],
            anio: [null]
        });
    }

    guardarTramite() {
        if (this.validarFormulario()) {
            let text = `Recuerde que, una vez enviada la información, esta será verificada mediante inspección.”`;

            if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION && sessionStorage.getItem('esCambioUbicacion') == 'false') {
                text = ``;
            }
            this.messageService.questionCustom(`¿Está seguro de gestionar el trámite “${this.establecimientoSeleccionado.tramiteActual?.tipo?.nombre}” ante el ${environment.MINISTERIO}?`, text, 'Si, Gestionar').then((result) => {
                if (result.isConfirmed) {
                    this.dialogoCrearTramite = true;

                    this.tramitesHttpService.guardarTramiteAlojamientoGalapagos(this.establecimientosService.establecimiento).subscribe(
                        (tramiteActual) => {
                            if (this.clasificacion.value.codigo === ClasificacionCodigoEnum.CASA_HUESPEDES && this.establecimientosService.establecimiento.tramiteActual?.tipo?.codigo != TramiteTiposEnum.ACTUALIZACION) {
                                const formData = new FormData();
                                formData.append('certificadoInactivacion', this.certificadoInactivacionControl.value);
                                formData.append('codigoInactivacion', this.codigoInactivacionControl.value);
                                formData.append('fechaInactivacion', format(this.fechaInactivacionControl.value, 'yyyy-MM-dd'));
                                this.tramitesHttpService.guardarTramiteAlojamientoCertificadoInactivacion(this.establecimientoSeleccionado.tramiteActual?.id!, formData).subscribe(
                                    (tramiteActual) => {
                                        this.dialogoCrearTramite = false;
                                    },
                                    (error) => (this.dialogoCrearTramite = false)
                                );
                            }
                            this.descargarDocumento(tramiteActual);

                            this.dialogoCrearTramite = false;
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

                if (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS) {
                    this.catastrosHttpService.obtenerDocumentoUsuarioExterno(catastro.id!, 'tarifario_rack').subscribe((documento) => {
                        this.coreService.descargarDocumentoPDF(documento, 'tarifario_rack_' + catastro.numeroRegistro);
                    });
                }
            });

            this.catastrosHttpService.obtenerDocumentoUsuarioExterno(catastro.id!, 'check_list_externo').subscribe((documento) => {
                this.coreService.descargarDocumentoPDF(documento, 'check_list_' + catastro.numeroRegistro);
            });
        }
    }

    validarFormulario(): boolean {
        this.camposInvalidos = [];

        // if (!this.formulario.valid) {
        if (this.tieneServiciosComplementariosField.value && this.serviciosComplementariosField.value?.length === 0) {
            this.camposInvalidos.push('Servicios Complementarios');
        }

        if (this.tieneModalidadesTurismoAventuraField.value && this.modalidadesTurismoAventuraField.value?.length === 0) {
            this.camposInvalidos.push('Modalidades Turismo Aventura');
        }
        // }

        if (!this.validarHabitaciones()) {
            this.camposInvalidos.push('Habitaciones');
        }

        if (this.normativaRespuestas.length === 0 && this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo != TramiteTiposEnum.ACTUALIZACION) {
            this.camposInvalidos.push('Normativa');
        }

        if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REGISTRO && this.clasificacion.value.codigo === ClasificacionCodigoEnum.CASA_HUESPEDES && !this.certificadoInactivacionControl.valid) {
            this.camposInvalidos.push('Certificado de Inactivación');
        }

        if (!this.capacidadField.valid) {
            this.camposInvalidos.push('Capacidad en número de personas');
        }

        return this.camposInvalidos.length === 0 && this.formulario.valid;
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
            if (this.indiceHabitacion === -1) {
                this.indiceHabitacion = this.habitacionesField.value.findIndex((element: HabitacionModel) => element.tipoHabitacion?.id === this.habitacionTipoField.value?.id);
            }

            if (this.indiceHabitacion > -1) {
                if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo !== TramiteTiposEnum.REGISTRO) {
                    if (this.habitacionPlazasField.value > this.habitacionesField.value[this.indiceHabitacion].plazas) {
                        this.messageService.getErrorsCustom('No puede aumentar el número de plazas', 'Solo puede mantener o disminuir');
                        this.mostrarDialogoNuevaHabitacion = false;
                        return;
                    }
                }

                this.messageService.getInfoCustom('Actualización', 'La habitación fue actualizada.');
                this.habitacionesField.value[this.indiceHabitacion] = this.formularioHabitacion.value;
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

            this.tipoHabitaciones = this.tipoHabitacionesClon.filter((habitacion) => habitacion.id != this.habitacionTipoField.value);
            this.formularioHabitacion.reset();
            this.mostrarDialogoNuevaHabitacion = false;
        } else {
            this.formularioHabitacion.markAllAsTouched();
        }
    }

    editarHabitacion(indice: number, habitacion: HabitacionModel) {
        this.mostrarDialogoNuevaHabitacion = true;
        this.indiceHabitacion = indice;
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

    agregarServicioComplementario() {
        if (this.formularioServicioComplementario.valid) {
            if (this.indexServicioComplementario > -1) {
                this.serviciosComplementariosField.value[this.indexServicioComplementario] = this.formularioServicioComplementario.value;
            } else {
                this.serviciosComplementariosField.value.push(this.formularioServicioComplementario.value);
            }
            // this.normativaRespuestasField.patchValue(this.normativaAlimentosBebidasRespuestas);

            if (this.establecimientoSeleccionado.tramiteActual) {
                this.establecimientoSeleccionado.tramiteActual.serviciosComplementarios = this.serviciosComplementariosField.value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }

            this.mostrarDialogoNuevoServicioComplementario = false;
        } else {
            this.formularioServicioComplementario.markAllAsTouched();
        }
    }

    editarServicioComplementario(servicioComplementario: ServicioComplementarioModel, index: number) {
        this.mostrarDialogoNuevoServicioComplementario = true;
        this.indexServicioComplementario = index;
        this.formularioServicioComplementario.patchValue(servicioComplementario);
    }

    eliminarServicioComplementario(index: number) {
        this.serviciosComplementariosField.value.splice(index, 1);

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.serviciosComplementarios = this.serviciosComplementariosField.value;
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }
    }

    obtenerClasificaciones() {
        this.clasificacionesHttpService.obtenerClasificacionesParaServiciosComplementarios('alimentos_bebidas_galapagos').subscribe((clasificaciones) => {
            this.clasificaciones = clasificaciones.filter((clasificacion) => clasificacion.esServicioComplementario);
        });
    }

    obtenerTipoHabitaciones(categoriaId: number) {
        this.categoriasHttpService.obtenerTipoHabitacionesPorCategoria(categoriaId).subscribe((tipoHabitaciones) => {
            this.tipoHabitaciones = tipoHabitaciones;
            this.tipoHabitacionesClon = tipoHabitaciones;
        });
    }

    obtenerModalidadesTurismoAventura() {
        const catalogos: CatalogoModel[] = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.MODALIDADES_AVENTURA_TURISMO);

        catalogos.forEach((catalogo) => {
            if (catalogo.codigo === 'agua') {
                this.modalidadesTurismoAventuraAgua = catalogo.hijos!;
            }
            if (catalogo.codigo === 'aire') {
                this.modalidadesTurismoAventuraAire = catalogo.hijos!;
            }
            if (catalogo.codigo === 'tierra') {
                this.modalidadesTurismoAventuraTierra = catalogo.hijos!;
            }
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

    get serviciosComplementariosField() {
        return this.formulario.controls['serviciosComplementarios'];
    }

    get tieneServiciosComplementariosField() {
        return this.formulario.controls['tieneServiciosComplementarios'];
    }

    get tieneModalidadesTurismoAventuraField() {
        return this.formulario.controls['tieneModalidadesTurismoAventura'];
    }

    get clasificacionField() {
        return this.formularioServicioComplementario.controls['clasificacion'];
    }

    get capacidadField() {
        return this.formularioServicioComplementario.controls['capacidad'];
    }

    get normativaRespuestasField() {
        return this.formularioServicioComplementario.controls['normativaRespuestas'];
    }

    get usoSuelosField(): AbstractControl {
        return this.formulario.controls['usoSuelos'];
    }

    get habitacionTarifa(): FormGroup {
        return this.formularioHabitacion.controls['habitacionTarifa'] as FormGroup;
    }

    get habitacionTemporadaAltaField() {
        return this.habitacionTarifa.controls['habitacionTemporadaAlta'];
    }

    get habitacionTemporadaBajaField() {
        return this.habitacionTarifa.controls['habitacionTemporadaBaja'];
    }

    get personaTemporadaBajaField() {
        return this.habitacionTarifa.controls['personaTemporadaBaja'];
    }

    get personaTemporadaAltaField() {
        return this.habitacionTarifa.controls['personaTemporadaAlta'];
    }

    protected readonly environment = environment;
}
