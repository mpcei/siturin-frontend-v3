import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { ActividadModel, CatalogoModel, EstablecimientoModel, RucModel, TramiteModel } from '@models/siturin';
import { AuthService } from '@services/auth';
import { CatalogosSiturinHttpService, CatastrosHttpService, DinardapHttpService, EstablecimientosHttpService, EstablecimientosService, TramitesHttpService } from '@services/siturin';
import { CoreService, MessageService } from '@services/core';
import { ActividadCodigoEnum, CatastroEstadoEnum, EstablecimientoEstadoEnum, InspeccionEstadoFechaEnum, RucEstadoEnum } from '@shared/enums';
import { TramiteTiposEnum } from '@shared/enums/siturin/tramite.enum';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { InputText } from 'primeng/inputtext';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, DatePipe } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { Tag } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { TramitesComponent } from '../tramites/tramites.component';
import { DatosSriComponent } from '../../../compartido/datos-sri/datos-sri.component';
import { DatosSuperciasComponent } from '../../../compartido/datos-supercias/datos-supercias.component';

@Component({
    selector: 'app-establecimientos',
    templateUrl: './establecimientos.component.html',
    styleUrls: ['./establecimientos.component.scss'],
    imports: [
        Bind,
        Card,
        LabelDirective,
        ReactiveFormsModule,
        InputText,
        NgIf,
        ButtonDirective,
        TableModule,
        PrimeTemplate,
        NgFor,
        NgSwitch,
        NgSwitchCase,
        Tag,
        NgSwitchDefault,
        Tooltip,
        TramitesComponent,
        DatosSriComponent,
        DatosSuperciasComponent,
        DatePipe
    ]
})
export class EstablecimientosComponent implements OnInit {
    private authService = inject(AuthService);
    private catalogosSiturinHttpService = inject(CatalogosSiturinHttpService);
    private establecimientosHttpService = inject(EstablecimientosHttpService);
    private catastrosHttpService = inject(CatastrosHttpService);
    private coreService = inject(CoreService);
    private establecimientosService = inject(EstablecimientosService);
    private dinardapHttpService = inject(DinardapHttpService);
    private formBuilder = inject(FormBuilder);
    public messageService = inject(MessageService);
    private router = inject(Router);
    private tramitesHttpService = inject(TramitesHttpService);

    numeroRuc: FormControl = new FormControl<string>('', [Validators.required, Validators.maxLength(13), Validators.maxLength(13)]);
    esEstablecimientoSeleccionado: boolean = false;
    ruc: RucModel = {};
    columnasTabla: ColumnModel[] = [];
    columnasTramitesTabla: ColumnModel[] = [];
    cargado$ = this.coreService.loaded$;
    buscador: FormControl = new FormControl('');
    establecimientoSeleccionado: EstablecimientoModel = {};
    establecimientos: EstablecimientoModel[] = [];
    establecimientosClon: EstablecimientoModel[] = [];
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

        this.buscador.valueChanges.subscribe((value) => {
            if (this.establecimientosClon.length > 0) this.filtrarEstablecimientos(value);
        });
    }

    ngOnInit(): void {
        this.numeroRuc.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
            this.esEstablecimientoSeleccionado = false;
            if (value?.length === 13) this.obtenerEstablecimientos(value);
        });
    }

    inicializarEstablecimiento() {
        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    }

    obtenerTramitesPorEstablecimiento(establecimiento: EstablecimientoModel) {
        this.tramitesHttpService.obtenerTramitesPorEstablecimiento(establecimiento.id!).subscribe((tramites) => {
            this.tramites = tramites;
        });
    }

    obtenerEstablecimientos(numeroRuc: string) {
        this.cargando = true;
        this.establecimientosHttpService.obtenerEstablecimientosPorRuc(numeroRuc).subscribe(
            (establecimientos) => {
                this.establecimientos = establecimientos.filter((establecimiento) => establecimiento.tramiteActual);
                this.establecimientosClon = establecimientos.filter((establecimiento) => establecimiento.tramiteActual);

                if (this.establecimientos.length > 0) this.ruc = this.establecimientos[0].ruc!;
                else this.messageService.getErrorsCustom(`El RUC, no cuenta con establecimientos que tengan registro de turismo otorgados por esta Cartera de Estado`, '');
                this.cargando = false;
            },
            (error) => {
                this.cargando = false;
                this.ruc = {};
            }
        );
    }

    configurarColumnasTabla() {
        this.columnasTabla = [
            { field: 'numero', header: 'Nro.' },
            { field: 'nombreComercial', header: 'Nombre Comercial' },
            { field: 'provincia', header: 'Provincia' },
            { field: 'canton', header: 'Cantón' },
            { field: 'parroquia', header: 'Parroquia' },
            { field: 'ubicacionString', header: 'Dirección' }
        ];
    }

    configurarColumnasTramitesTabla() {
        this.columnasTramitesTabla = [
            { field: 'actividad', header: 'Actividad' },
            { field: 'tipo', header: 'Número de Registro' },
            { field: 'catastro', header: 'Estado' }
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
        this.seleccionarEstablecimiento(establecimiento);
        this.dialogoTiposTramites = true;
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
        this.tramiteOpcionesAlimentosBebidas = this.obtenerOpcionesTramitesAlimentosBebidas(tramiteActual);
        // this.dialogoTramitesAlimentosBebidas = false;
        this.dialogoTiposTramitesAlimentosBebidas = true;
    }

    mostrarTramites(establecimiento: EstablecimientoModel) {
        this.esEstablecimientoSeleccionado = true;
        this.establecimientoSeleccionado = establecimiento;
    }

    mostrarFechaInpseccion(establecimiento: EstablecimientoModel) {
        this.dialogoTitulo = `Fecha Inspección -
    ${establecimiento?.nombreComercial}
    ${establecimiento.tramiteActual?.actividad?.nombre} /
    ${establecimiento.tramiteActual?.clasificacion?.nombre}  /
    ${establecimiento.tramiteActual?.categoria?.nombre}`;

        if (establecimiento.tramiteActual?.inspeccionActual?.estadoFecha?.codigo !== InspeccionEstadoFechaEnum.AUTO_GENERADA) {
            this.fechaAgendaTramite.setValue(new Date(establecimiento.tramiteActual?.inspeccionActual?.fechaInspeccion!));
        }

        if (establecimiento.tramiteActual?.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA) {
            this.fechaAgendaTramite.setValue(new Date(establecimiento.tramiteActual?.inspeccionActual?.fechaSolicitud!));
        }

        this.fechaMaximaAgenda = new Date(establecimiento.tramiteActual?.inspeccionActual?.fechaInspeccion!);
        this.dialogoFechaInspeccion = true;
        this.seleccionarEstablecimiento(establecimiento);
    }

    mostrarFechaInpseccionAlimentosBebidas(tramiteActual: TramiteModel) {
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

    seleccionarEstablecimiento(establecimiento: EstablecimientoModel) {
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

        if (!catastro || catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REGISTRO);
        }

        if (
            catastro &&
            (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALOJAMIENTO_CONTINENTE ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_CONTINENTE ||
                tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_GALAPAGOS)
        ) {
            tieneRegistro = catastro?.estado?.codigo === CatastroEstadoEnum.RATIFICADO || catastro?.estado?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO || catastro?.estado?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO;

            tieneInactivacion = catastro?.estado?.codigo === CatastroEstadoEnum.INACTIVO;

            tienePendienteInspeccion = catastro?.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION;

            tienesSuspensionTemporal = catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL;

            tienesSuspensionDefinitiva = catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA;
        }

        if (catastro && (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE || tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS)) {
        }

        if (tieneRegistro && (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_CONTINENTE || tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_GALAPAGOS)) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION || tramiteTipo.codigo === TramiteTiposEnum.RECLASIFICACION || tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION);
        }

        if (tieneRegistro) {
            return this.tramiteTipos.filter(
                (tramiteTipo) =>
                    tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION || tramiteTipo.codigo === TramiteTiposEnum.RECLASIFICACION || tramiteTipo.codigo === TramiteTiposEnum.RECATEGORIZACION || tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION
            );
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

        if (!catastro) {
            return this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REGISTRO);
        }

        if (catastro && (tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE || tramiteActual?.actividad?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS)) {
            tieneRegistro = catastro?.estado?.codigo === CatastroEstadoEnum.RATIFICADO || catastro?.estado?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO || catastro?.estado?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO;

            tieneInactivacion = catastro?.estado?.codigo === CatastroEstadoEnum.INACTIVO;

            tienePendienteInspeccion = catastro?.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION;

            tienesSuspensionTemporal = catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL;

            tienesSuspensionDefinitiva = catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA;
        }

        if (tieneRegistro) {
            opciones = this.tramiteTipos.filter(
                (tramiteTipo) =>
                    tramiteTipo.codigo === TramiteTiposEnum.INACTIVACION || tramiteTipo.codigo === TramiteTiposEnum.RECLASIFICACION || tramiteTipo.codigo === TramiteTiposEnum.RECATEGORIZACION || tramiteTipo.codigo === TramiteTiposEnum.ACTUALIZACION
            );
        }

        if (tieneInactivacion) {
            opciones = this.tramiteTipos.filter((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.REINGRESO);
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
                return;
            }

            if (!this.establecimientoSeleccionado.nombreComercial || this.establecimientoSeleccionado.nombreComercial.length === 0) {
                this.messageService.getErrorsCustom('No se puede crear un trámite', 'El establecimiento no cuenta con Nombre Comercial');
                this.dialogoTiposTramites = false;
                return;
            }
        }

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.tipo = tramiteTipo;
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
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL ||
                tramite.catastro?.estado?.codigo === CatastroEstadoEnum.INACTIVO
            ) {
                totalRegistros++;
            }
        });

        if (totalRegistros >= 5) {
            this.messageService.getErrorsCustom('No se puede crear una Nueva Clasificación', 'El límite es 5');
            this.dialogoTramitesAlimentosBebidas = false;
            return;
        }

        const tramiteTipo = this.tramiteTipos.find((tramiteTipo) => tramiteTipo.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION);
        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.tipo = tramiteTipo;
        }

        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

        this.router.navigate(['siturin/externo/proceso-acreditacion']);
    }

    solictarInspeccion(establecimiento: EstablecimientoModel) {}

    filtrarEstablecimientos(filtro: string) {
        filtro = filtro.toLowerCase();

        this.establecimientos = this.establecimientosClon.filter((e) => e.numero?.toString()?.includes(filtro) || e.nombreComercial?.toLowerCase()?.includes(filtro));
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
}
