import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { addMonths, format, isAfter, isBefore } from 'date-fns';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { Toolbar } from 'primeng/toolbar';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { ErrorMessageDirective } from '../../../../legacy/shared/directives/error-message.directive';
import { InactivacionComponent } from '../proceso-acreditacion/inactivacion/inactivacion.component';
import { TarifarioRackComponent } from '../proceso-acreditacion/tarifario-rack/tarifario-rack.component';
import { ColumnModel } from '@/legacy/models/core';
import { ActividadModel, CatalogoModel, EstablecimientoModel, TramiteModel } from '@/legacy/models/siturin';
import { AuthService } from '@/legacy/services/auth';
import { CatalogosSiturinService, CatastrosHttpService, DinardapHttpService, EstablecimientosHttpService, EstablecimientosService, TramitesHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { ActividadCodigoEnum, CatalogoSiturinTipoEnum, CatastroEstadoEnum, ClasificacionCodigoEnum, EstablecimientoEstadoEnum, InspeccionEstadoFechaEnum, RucEstadoEnum, TramiteTiposEnum } from '@/legacy/shared/enums';

@Component({
    host: { class: 'siturin-legacy' },
    selector: 'app-establecimiento-list',
    templateUrl: './establecimiento-list.component.html',
    styleUrls: ['./establecimiento-list.component.scss'],
    imports: [
        Bind,
        Card,
        Toolbar,
        ButtonDirective,
        TableModule,
        PrimeTemplate,
        ReactiveFormsModule,
        InputText,
        NgFor,
        NgIf,
        NgSwitch,
        NgSwitchCase,
        Tag,
        NgSwitchDefault,
        Tooltip,
        RouterLink,
        Dialog,
        DatePicker,
        ErrorMessageDirective,
        InactivacionComponent,
        TarifarioRackComponent,
        AsyncPipe,
        DatePipe
    ]
})
export class EstablecimientoListComponent implements OnInit {

     private authService=inject( AuthService);
    private catalogosSiturinService=inject( CatalogosSiturinService);
    private establecimientosHttpService=inject( EstablecimientosHttpService);
    private catastrosHttpService=inject( CatastrosHttpService);
    private coreService=inject( CoreService);
    private establecimientosService=inject( EstablecimientosService);
    private dinardapHttpService=inject( DinardapHttpService);
    private formBuilder=inject( FormBuilder);
    public messageService=inject( MessageService);
    private router=inject( Router);
    private tramitesHttpService=inject( TramitesHttpService);

    columnasTabla: ColumnModel[] = [];
    columnasTramitesTabla: ColumnModel[] = [];
    cargado$ = this.coreService.loaded$;
    buscador: FormControl = new FormControl('');
    establecimientosSeleccionados: EstablecimientoModel[] = [];
    establecimientoSeleccionado: EstablecimientoModel = {};
    establecimientos: EstablecimientoModel[] = [];
    tramites: TramiteModel[] = [];
    tramiteTipos: CatalogoModel[] = [];
    tramiteOpcionesAlimentosBebidas: CatalogoModel[] = [];
    erroresEstablecimiento: string[] = [];
    tramitesSeleccionados: TramiteModel[] = [];
    tramiteSeleccionado: FormControl = new FormControl(null);
    dialogoTiposTramites: boolean = false;
    dialogoTramites: boolean = false;
    dialogoTramitesAlimentosBebidas: boolean = false;
    dialogoTiposTramitesAlimentosBebidas: boolean = false;
    dialogoFechaInspeccion: boolean = false;
    dialogoCausalesInactivacion: boolean = false;
    dialogoTarifarioRack: boolean = false;
    cargando: boolean = false;
    fechaAgendaTramite: FormControl = new FormControl(null, [Validators.required]);
    dialogoTitulo: string = '';
    fechaActual: Date = new Date();
    fechaMaximaAgenda: Date = new Date('2100-12-31');
    tramiteTipoAlimentosBebidas: CatalogoModel = {};
    formularioHabitacion: FormGroup = this.nuevoFormularioHabitacion;

    constructor() {
        this.configurarColumnasTabla();
        this.configurarColumnasTramitesTabla();
        this.inicializarEstablecimiento();
    }

    inicializarEstablecimiento() {
        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.obtenerTramiteTipos();
        }, 1500);
        this.sincronizarDinardapRuc();
    }

    obtenerTramiteTipos() {
        this.tramiteTipos = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TRAMITE_TIPOS);
        console.log(this.tramiteTipos)
        this.obtenerEstablecimientos();
    }

    obtenerTramitesPorEstablecimiento(establecimiento: EstablecimientoModel) {
        this.tramitesHttpService.obtenerTramitesPorEstablecimiento(establecimiento.id!).subscribe((tramites) => {
            this.tramites = tramites;
        });
    }

    obtenerEstablecimientos() {
        this.cargando = true;
        this.establecimientosHttpService.obtenerEstablecimientosPorRuc(this.authService.auth.identification!).subscribe(
            (establecimientos) => {
                this.establecimientos = establecimientos;
                this.cargando = false;
                this.establecimientosService.removerEstablecimiento();
                // establecimientos.forEach(establecimiento => {
                //   establecimiento.tramiteOpciones = this.obtenerOpcionesTramites(establecimiento);
                // });
            },
            (error) => (this.cargando = false)
        );
    }

    sincronizarDinardapRuc() {
        this.dinardapHttpService.obtenerRuc(this.authService.auth.identification!).subscribe((data) => {
            if (data.establecimientos) {
                this.establecimientosHttpService.actualizarEstablecimientosDinardap(data).subscribe(() => {
                    this.obtenerEstablecimientos();
                });
            }
        });
    }

    configurarColumnasTabla() {
        this.columnasTabla = [
            { field: 'numero', header: 'Nro.' },
            { field: 'nombreComercial', header: 'Nombre Comercial' },
            { field: 'ubicacionString', header: 'Ubicación de Establecimiento' },
            { field: 'tramiteActual', header: 'Actividad' },
            { field: 'catastro', header: 'Número de Registro' },
            { field: 'catastroEstado', header: 'Estado Catastro' }
        ];
    }

    configurarColumnasTramitesTabla() {
        this.columnasTramitesTabla = [
            { field: 'actividad', header: 'Actividad' },
            { field: 'tipo', header: 'Número de Registro' },
            { field: 'catastro', header: 'Estado Catastro' }
        ];
    }

    configurarColumnasTramitesAlimentosBebidasTabla() {
        this.columnasTramitesTabla = [
            { field: 'actividad', header: 'Actividad' },
            { field: 'fecha', header: 'Fecha' },
            { field: 'tipo', header: 'Tipo' },
            { field: 'catastro', header: 'Estado' }
        ];
    }

    mostrarCrearTramite(establecimiento: EstablecimientoModel) {
        this.seleccionarEstablecimiento(establecimiento).then(() => {
            this.establecimientoSeleccionado.tramiteOpciones = this.obtenerOpcionesTramites(establecimiento);
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            this.dialogoTiposTramites = true;
        });
    }

    mostrarTramitesAlimentosBebidas(establecimiento: EstablecimientoModel) {
        this.seleccionarEstablecimiento(establecimiento);
        this.dialogoTramitesAlimentosBebidas = true;
    }

    mostrarCrearTramitesAlimentosBebidas(tramiteActual: TramiteModel) {
        if (tramiteActual?.establecimiento && (!tramiteActual?.establecimiento.nombreComercial || tramiteActual?.establecimiento.nombreComercial.length === 0)) {
            this.messageService.getErrorsCustom('No se puede crear un trámite', 'El establecimiento no cuenta con Nombre Comercial');
            return;
        }

        this.establecimientoSeleccionado.tramiteActual = tramiteActual;
        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

        // this.seleccionarEstablecimiento(this.establecimientoSeleccionado).then(() => {
        this.tramiteOpcionesAlimentosBebidas = this.obtenerOpcionesTramitesAlimentosBebidas(tramiteActual);
        this.dialogoTiposTramitesAlimentosBebidas = true;
        // });
    }

    mostrarTramites(establecimiento: EstablecimientoModel) {
        this.dialogoTramites = true;
        this.seleccionarEstablecimiento(establecimiento);
        this.obtenerTramitesPorEstablecimiento(establecimiento);
    }

    mostrarFechaInpseccion(establecimiento: EstablecimientoModel) {
        this.seleccionarEstablecimiento(establecimiento).then(() => {
            this.dialogoTitulo = `Fecha Inspección -
    ${this.establecimientoSeleccionado?.nombreComercial}
    ${this.establecimientoSeleccionado.tramiteActual?.actividad?.nombre} /
    ${this.establecimientoSeleccionado.tramiteActual?.clasificacion?.nombre}  /
    ${this.establecimientoSeleccionado.tramiteActual?.categoria?.nombre}`;

            if (this.establecimientoSeleccionado.tramiteActual?.inspeccionActual?.estadoFecha?.codigo !== InspeccionEstadoFechaEnum.AUTO_GENERADA) {
                this.fechaAgendaTramite.setValue(new Date(this.establecimientoSeleccionado.tramiteActual?.inspeccionActual?.fechaInspeccion!));
            }

            if (this.establecimientoSeleccionado.tramiteActual?.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA) {
                this.fechaAgendaTramite.setValue(new Date(this.establecimientoSeleccionado.tramiteActual?.inspeccionActual?.fechaSolicitud!));
            }

            if (establecimiento.tramiteActual?.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
                this.fechaMaximaAgenda = new Date('2050-01-01');
            } else {
                this.fechaMaximaAgenda = new Date(this.establecimientoSeleccionado.tramiteActual?.inspeccionActual?.fechaInspeccion!);
            }

            this.dialogoFechaInspeccion = true;
        });
    }

    mostrarFechaInspeccionAlimentosBebidas(tramiteActual: TramiteModel) {
        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual = tramiteActual;
        }

        this.dialogoTitulo = `Fecha Inspección -
    ${this.establecimientoSeleccionado?.nombreComercial}
    ${tramiteActual?.actividad?.nombre} /
    ${tramiteActual?.clasificacion?.nombre}  /
    ${tramiteActual?.categoria?.nombre}`;

        if (tramiteActual?.inspeccionActual?.estadoFecha?.codigo !== InspeccionEstadoFechaEnum.AUTO_GENERADA) {
            this.fechaAgendaTramite.setValue(new Date(tramiteActual?.inspeccionActual?.fechaInspeccion!));
        }

        if (tramiteActual?.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA) {
            this.fechaAgendaTramite.setValue(new Date(tramiteActual?.inspeccionActual?.fechaSolicitud!));
        }

        this.fechaMaximaAgenda = new Date(tramiteActual?.inspeccionActual?.fechaInspeccion!);
        this.dialogoFechaInspeccion = true;
    }

    mostrarTarifarioRack(establecimiento: EstablecimientoModel) {
        this.establecimientosService.establecimiento = establecimiento;
        // this.seleccionarEstablecimiento(establecimiento).then(() => {
        //   this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        //   this.dialogoTarifarioRack = true;
        // });
    }

    async seleccionarEstablecimiento(establecimiento: EstablecimientoModel) {
        // if (this.establecimientosService.establecimiento?.id === establecimiento?.id) {
        //   this.establecimientoSeleccionado = this.establecimientosService.establecimiento;
        //   return;
        // }
        this.cargando = true;
        await this.establecimientosHttpService
            .obtenerEstablecimientoPorTramite(establecimiento.id!)
            .toPromise()
            .then((establecimiento) => {
                this.cargando = false;

                if (establecimiento) {
                    if (!establecimiento.personaContacto) this.establecimientoSeleccionado.personaContacto = {};
                    else this.establecimientoSeleccionado.personaContacto = establecimiento.personaContacto;

                    if (!establecimiento.tramiteActual) this.establecimientoSeleccionado.tramiteActual = {};
                    else this.establecimientoSeleccionado.tramiteActual = establecimiento.tramiteActual;

                    if (!establecimiento.ubicacion) this.establecimientoSeleccionado.ubicacion = {};
                    else this.establecimientoSeleccionado.ubicacion = establecimiento.ubicacion;

                    this.establecimientoSeleccionado.canton = establecimiento.canton;
                    this.establecimientoSeleccionado.esMatriz = establecimiento.esMatriz;
                    this.establecimientoSeleccionado.estado = establecimiento.estado;
                    this.establecimientoSeleccionado.id = establecimiento.id;
                    this.establecimientoSeleccionado.nombreComercial = establecimiento.nombreComercial;
                    this.establecimientoSeleccionado.numero = establecimiento.numero;
                    this.establecimientoSeleccionado.paginaWeb = establecimiento.paginaWeb;
                    this.establecimientoSeleccionado.parroquia = establecimiento.parroquia;
                    this.establecimientoSeleccionado.provincia = establecimiento.provincia;
                    this.establecimientoSeleccionado.ruc = establecimiento.ruc;
                    this.establecimientoSeleccionado.tramiteOpciones = establecimiento.tramiteOpciones;
                    this.establecimientoSeleccionado.tramites = establecimiento.tramites;

                    this.establecimientosService.establecimiento = establecimiento;
                }
            });
    }

    validarEstablecimiento(establecimiento: EstablecimientoModel): number {
        this.erroresEstablecimiento = [];
        if (establecimiento.nombreComercial === '') {
            this.erroresEstablecimiento.push('Sin nombre comercial');
        }

        if (establecimiento.estado?.codigo === EstablecimientoEstadoEnum.CERRADO) {
            this.erroresEstablecimiento.push('Establecimiento cerrado');
        }

        if (establecimiento.ruc?.estado?.codigo === RucEstadoEnum.SUSPENDIDO) {
            this.erroresEstablecimiento.push('Ruc suspendido');
        }

        if (establecimiento.ruc?.estado?.codigo === RucEstadoEnum.SUSPENDIDO) {
            this.erroresEstablecimiento.push('Ruc suspendido');
        }

        return this.erroresEstablecimiento.length;
    }

    obtenerOpcionesTramites(establecimiento: EstablecimientoModel): CatalogoModel[] {
        let opciones: CatalogoModel[] = [];
        const tramiteActual = establecimiento.tramiteActual;
        const catastro = establecimiento.tramiteActual?.catastro;

        let tieneRegistro = false;
        let tieneInactivacion = false;
        let tienePendienteInspeccion = false;
        let tienesSuspensionTemporal = false;
        let tienesSuspensionDefinitiva = false;

        if ((establecimiento?.nombreComercial == '' || establecimiento.estado?.codigo == 'cerrado') && catastro && catastro?.estado?.codigo !== CatastroEstadoEnum.INACTIVO) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION);
        }

        if (!catastro || catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REGISTRO);
        }

        //Incluir el resto de actividades
        if (
            catastro &&
            (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALOJAMIENTO_CONTINENTE ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_CONTINENTE ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_GALAPAGOS ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.CTC_CONTINENTE ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.CTC_GALAPAGOS ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.TRANSPORTE_CONTINENTE ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.TRANSPORTE_GALAPAGOS)
        ) {
            tieneRegistro = catastro?.estado?.codigo === CatastroEstadoEnum.RATIFICADO || catastro?.estado?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO || catastro?.estado?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO;

            tieneInactivacion = catastro?.estado?.codigo === CatastroEstadoEnum.INACTIVO;

            tienePendienteInspeccion = catastro?.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION;

            tienesSuspensionTemporal = catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL;

            tienesSuspensionDefinitiva = catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA;
        }

        if (tieneInactivacion) {
            if (tramiteActual?.fecha) {
                const fechaTramite = new Date(tramiteActual.fecha);
                const addDate = addMonths(fechaTramite, 6);

                if (isAfter(new Date(), addDate) || isBefore(fechaTramite, new Date('2024-04-26'))) {
                    return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REINGRESO);
                }
            }

            return [];
        }

        if (catastro && (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE || tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS)) {
        }

        if ((tieneRegistro && tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALOJAMIENTO_CONTINENTE) || (tieneRegistro && tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS)) {
            if (tramiteActual.clasificacion?.codigo === ClasificacionCodigoEnum.INMUEBLES_HABITACIONALES) {
                return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION || tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION);
            }
        }

        if (tieneRegistro && (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_CONTINENTE || tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_GALAPAGOS)) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION || tramiteTipo.codigo === TramiteTiposEnum.RECLASIFICACION || tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION);
        }

        if (tieneRegistro && (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.TRANSPORTE_CONTINENTE || tramiteActual?.actividad?.codigo === ActividadCodigoEnum.TRANSPORTE_GALAPAGOS)) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION || tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION);
        }

        if (tieneRegistro && (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.CTC_CONTINENTE || tramiteActual?.actividad?.codigo === ActividadCodigoEnum.CTC_GALAPAGOS)) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION || tramiteTipo.codigo === TramiteTiposEnum.NUEVA_ACTIVIDAD || tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION);
        }

        if (tieneRegistro) {
            if (tramiteActual?.clasificacion?.tieneRecategorizacion) {
                return this.tramiteTipos.filter(
                    (tramiteTipo) =>
                        tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION ||
                        tramiteTipo.codigo === TramiteTiposEnum.RECLASIFICACION ||
                        tramiteTipo.codigo === TramiteTiposEnum.RECATEGORIZACION ||
                        tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION
                );
            }

            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION || tramiteTipo.codigo === TramiteTiposEnum.RECLASIFICACION || tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION);
        }

        if (tieneInactivacion) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REINGRESO);
        }

        if (tienePendienteInspeccion) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION);
        }

        if (tienesSuspensionTemporal) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION);
        }

        if (tienesSuspensionDefinitiva) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REGISTRO);
        }

        return opciones;
    }

    obtenerOpcionesTramitesAlimentosBebidas(tramiteActual: TramiteModel): CatalogoModel[] {
        let opciones: CatalogoModel[] = [];
        const catastro = tramiteActual?.catastro;

        let tieneRegistro = false;
        let tieneInactivacion = false;
        let tienePendienteInspeccion = false;
        let tienesSuspensionTemporal = false;
        let tienesSuspensionDefinitiva = false;
        let tieneInspeccionAutoGenerada = false;
        let actividad: ActividadModel = {};
        let totalClasificaciones: number = 0;

        if ((this.establecimientoSeleccionado?.nombreComercial == '' || this.establecimientoSeleccionado.estado?.codigo == 'cerrado') && catastro && catastro?.estado?.codigo !== CatastroEstadoEnum.INACTIVO) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION);
        }

        if (!catastro) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REGISTRO);
        }

        if (
            catastro &&
            (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.PARQUES_CONTINENTE ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.PARQUES_GALAPAGOS ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.EVENTOS_CONTINENTE ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.EVENTOS_GALAPAGOS)
        ) {
            tieneRegistro = catastro?.estado?.codigo === CatastroEstadoEnum.RATIFICADO || catastro?.estado?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO || catastro?.estado?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO;

            tieneInactivacion = catastro?.estado?.codigo === CatastroEstadoEnum.INACTIVO;

            tienePendienteInspeccion = catastro?.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION;

            tienesSuspensionTemporal = catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL;

            tienesSuspensionDefinitiva = catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA;
        }

        if (tieneRegistro) {
            if (tramiteActual?.clasificacion?.tieneRecategorizacion) {
                opciones = this.tramiteTipos.filter(
                    (tramiteTipo) =>
                        tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION ||
                        tramiteTipo.codigo === TramiteTiposEnum.RECLASIFICACION ||
                        tramiteTipo.codigo === TramiteTiposEnum.RECATEGORIZACION ||
                        tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION
                );
            } else {
                opciones = this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION || tramiteTipo.codigo === TramiteTiposEnum.RECLASIFICACION || tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION);
            }
        }

        if (tieneInactivacion) {
            let addDate = new Date();

            if (tramiteActual.fecha) {
                const fechaTramite = new Date(tramiteActual.fecha);
                const addDate = addMonths(fechaTramite, 6);

                if (isAfter(new Date(), addDate) || isBefore(fechaTramite, new Date('2024-04-26'))) return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REINGRESO);

                return [];
            }
            // opciones = this.tramiteTipos.filter(tramiteTipo => tramiteTipo.codigo === TramiteTiposEnum.REINGRESO);
        }

        if (tienePendienteInspeccion) {
            opciones = this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION);
        }

        if (tienesSuspensionTemporal) {
            opciones = this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION);
        }

        if (tienesSuspensionDefinitiva) {
            opciones = this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REGISTRO);
        }

        return opciones;
    }

    irTramite(establecimiento: EstablecimientoModel) {
        this.seleccionarEstablecimiento(establecimiento);

        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

        this.router.navigate(['siturin/externo/proceso-acreditacion']);
    }

    crearTramite(tramiteTipo: CatalogoModel) {
        if (tramiteTipo.codigo != TramiteTiposEnum.INACTIVACION) {
            if (this.establecimientoSeleccionado.estado?.codigo !== EstablecimientoEstadoEnum.ABIERTO) {
                this.messageService.getErrorsCustom('No se puede crear un trámite', 'El establecimiento se encuentra cerrado');
                this.dialogoTiposTramites = false;
                this.dialogoTiposTramitesAlimentosBebidas = false;
                this.dialogoTramitesAlimentosBebidas = false;
                return;
            }

            if (!this.establecimientoSeleccionado.nombreComercial || this.establecimientoSeleccionado.nombreComercial.length === 0) {
                this.messageService.getErrorsCustom('No se puede crear un trámite', 'El establecimiento no cuenta con Nombre Comercial');
                this.dialogoTiposTramites = false;
                this.dialogoTiposTramitesAlimentosBebidas = false;
                this.dialogoTramitesAlimentosBebidas = false;
                return;
            }
        }

        if (this.establecimientoSeleccionado.tramiteActual) {
            if (tramiteTipo.codigo === TramiteTiposEnum.REGISTRO) {
                if (this.establecimientoSeleccionado.tramiteActual.id) {
                    this.establecimientoSeleccionado.tramiteActual.tipo = tramiteTipo;
                } else {
                    this.establecimientoSeleccionado.tramiteActual = { tipo: tramiteTipo };
                }
            } else if (tramiteTipo.codigo === TramiteTiposEnum.RECLASIFICACION) {
                this.establecimientoSeleccionado.tramiteActual.tipo = tramiteTipo;
                // this.establecimientoSeleccionado.tramiteActual.clasificacion = {};
                // this.establecimientoSeleccionado.tramiteActual.categoria = {};
            } else if (tramiteTipo.codigo === TramiteTiposEnum.RECATEGORIZACION) {
                this.establecimientoSeleccionado.tramiteActual.tipo = tramiteTipo;
                // this.establecimientoSeleccionado.tramiteActual.categoria = {};
            } else {
                this.establecimientoSeleccionado.tramiteActual.tipo = tramiteTipo;
            }
        }

        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

        switch (tramiteTipo.codigo) {
            case TramiteTiposEnum.INACTIVACION:
                this.dialogoCausalesInactivacion = true;
                this.dialogoTiposTramites = false;
                break;
            case TramiteTiposEnum.ACTUALIZACION:
            case TramiteTiposEnum.REINGRESO:
            case TramiteTiposEnum.RECLASIFICACION:
            case TramiteTiposEnum.RECATEGORIZACION:
            case TramiteTiposEnum.REGISTRO:
            case TramiteTiposEnum.NUEVA_ACTIVIDAD:
                this.router.navigate(['siturin/externo/proceso-acreditacion']);
                break;
        }
    }

    crearNuevaClasificacion() {
        if (this.establecimientoSeleccionado.estado?.codigo !== EstablecimientoEstadoEnum.ABIERTO) {
            this.messageService.getErrorsCustom('No se puede crear un trámite', 'El establecimiento se encuentra cerrado');
            return;
        }

        if (!this.establecimientoSeleccionado.nombreComercial || this.establecimientoSeleccionado.nombreComercial.length === 0) {
            this.messageService.getErrorsCustom('No se puede crear un trámite', 'El establecimiento no cuenta con Nombre Comercial');
            return;
        }

        let totalRegistros = 0;
        this.establecimientoSeleccionado.tramites?.forEach((tramite) => {
            if (
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION ||
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.RATIFICADO ||
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO ||
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO ||
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL
                // || tramite.catastro?.estado?.codigo === CatastroEstadoEnum.INACTIVO
            ) {
                totalRegistros++;
            }
        });

        let tieneNuevaActividad = this.establecimientoSeleccionado.tramites?.some((tramite) => {
            return (
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION ||
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.RATIFICADO ||
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO ||
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO ||
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL
            );
        });

        if ((!tieneNuevaActividad && this.establecimientoSeleccionado?.tramiteActual?.actividad?.codigo?.includes('parques')) || this.establecimientoSeleccionado?.tramiteActual?.actividad?.codigo?.includes('eventos')) {
            this.dialogoTramitesAlimentosBebidas = false;
            this.messageService.getErrorsCustom('No es posible crear una nueva actividad', 'El establecimiento tiene un registro inactivo');
            return;
        }

        if (
            (this.establecimientoSeleccionado.tramiteActual?.actividad?.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE ||
                this.establecimientoSeleccionado.tramiteActual?.actividad?.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS) &&
            totalRegistros >= 5
        ) {
            this.messageService.getErrorsCustom('No se puede crear una Nueva Clasificación', 'El límite es 5');
            this.dialogoTramitesAlimentosBebidas = false;
            return;
        }

        if (this.establecimientoSeleccionado?.tramiteActual?.actividad?.codigo?.includes('alimentos_bebidas_continente')) {
            const tramiteTipo = this.tramiteTipos.find((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION);
            if (this.establecimientoSeleccionado.tramiteActual) {
                this.establecimientoSeleccionado.tramiteActual.tipo = tramiteTipo;
            }
        }

        if (this.establecimientoSeleccionado?.tramiteActual?.actividad?.codigo?.includes('parques') || this.establecimientoSeleccionado?.tramiteActual?.actividad?.codigo?.includes('eventos')) {
            const tramiteTipo = this.tramiteTipos.find((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.NUEVA_ACTIVIDAD);
            if (this.establecimientoSeleccionado.tramiteActual) {
                this.establecimientoSeleccionado.tramiteActual.tipo = tramiteTipo;
                this.establecimientoSeleccionado.tramiteActual.clasificacion = {};
                this.establecimientoSeleccionado.tramiteActual.categoria = {};
            }
        }

        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

        this.router.navigate(['siturin/externo/proceso-acreditacion']);
    }

    solictarInspeccion(establecimiento: EstablecimientoModel) {}

    agendarTramite() {
        this.dialogoFechaInspeccion = false;
        this.dialogoTramitesAlimentosBebidas = false;
        this.messageService
            .questionCustom(`¿Está seguro de solicitar la inspección?`, `Considerar que al momento de la ejecución de la inspección se verificará el cumplimiento de todos los requisitos declarados y la normativa vigente`, 'Si, Solicitar')
            .then((result) => {
                if (result.isConfirmed) {
                    const fechaInspeccion = format(this.fechaAgendaTramite.value, 'yyyy-MM-dd HH:mm:ss');

                    this.tramitesHttpService
                        .agendarTramiteUsuarioExterno(this.establecimientoSeleccionado.tramiteActual?.id!, {
                            fechaInspeccion
                        })
                        .subscribe(
                            (tramite) => {
                                this.dialogoFechaInspeccion = false;
                                this.dialogoTramitesAlimentosBebidas = false;
                                this.obtenerEstablecimientos();
                            },
                            (error) => {
                                this.dialogoFechaInspeccion = false;
                                this.dialogoTramitesAlimentosBebidas = false;
                            }
                        );
                }
            });
    }

    descargarDocumento(tramiteActual: TramiteModel) {
        const catastro = tramiteActual?.catastro;
        if (catastro) {
            this.cargando = true;
            this.catastrosHttpService.obtenerDocumentoUsuarioExterno(catastro.id!, tramiteActual.tipo?.codigo!).subscribe(
                (documento) => {
                    this.coreService.descargarDocumentoPDF(documento, tramiteActual.tipo?.codigo + '_' + catastro.numeroRegistro);
                    this.cargando = false;
                },
                (error) => (this.cargando = false)
            );
        }
    }

    descargarTarifarioRack(tramiteActual: TramiteModel) {
        const catastro = tramiteActual?.catastro;
        if (catastro) {
            this.cargando = true;
            if (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS) {
                this.catastrosHttpService.obtenerDocumentoUsuarioExterno(catastro.id!, 'tarifario_rack').subscribe(
                    (documento) => {
                        this.coreService.descargarDocumentoPDF(documento, 'tarifario_rack_' + catastro.numeroRegistro);
                        this.cargando = false;
                    },
                    (error) => (this.cargando = false)
                );
            }
        }
    }

    inactivarTramiteAlimentosBebidas(event: boolean) {
        if (event) this.obtenerEstablecimientos();
        console.log('1');
        console.log(event);
        if (event) {
            console.log('entro');
            this.dialogoCausalesInactivacion = false;
            this.dialogoTiposTramitesAlimentosBebidas = false;
            this.dialogoTramitesAlimentosBebidas = false;
        }
    }

    get nuevoFormularioHabitacion() {
        return this.formBuilder.group({
            tipoHabitacion: [null, [Validators.required]],
            tramite: [null, []],
            camas: [0, [Validators.required, Validators.min(1)]],
            habitaciones: [0, [Validators.required, Validators.min(1)]],
            plazas: [0, [Validators.required, Validators.min(1)]],
            habitacionTarifa: this.nuevoFormularioHabitacionTarifa
        });
    }

    get nuevoFormularioHabitacionTarifa() {
        return this.formBuilder.group({
            habitacionTemporadaAlta: [null, [Validators.required]],
            habitacionTemporadaBaja: [null, [Validators.required]],
            personaTemporadaBaja: [null, [Validators.required]],
            personaTemporadaAlta: [null, [Validators.required]]
        });
    }

    get habitacionTipoField() {
        return this.formularioHabitacion.controls['tipoHabitacion'];
    }

    get habitacionCamasField() {
        return this.formularioHabitacion.controls['camas'];
    }

    get habitacionPlazasField() {
        return this.formularioHabitacion.controls['plazas'];
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

    get habitacionHabitacionesField() {
        return this.formularioHabitacion.controls['habitaciones'];
    }

    protected readonly environment = environment;
}
