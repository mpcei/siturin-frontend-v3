import { Component, EventEmitter, OnInit,inject, Output } from '@angular/core';
import { ColumnModel, FileModel, PaginatorModel } from '@models/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addBusinessDays, differenceInDays, format, formatDistanceStrict } from 'date-fns';
import { AsignacionModel, CatalogoModel, CatastroEstadoModel, CategoriaModel, ClasificacionModel, DpaModel, EstablecimientoModel, TramiteModel, UsuarioInternoDpaModel, ZonalModel } from '@models/siturin';
import { AuthService } from '@services/auth';
import { CoreHttpService, CoreService, MessageService } from '@services/core';
import {
    AsignacionesHttpService,
    CatalogosSiturinService,
    CatastroEstadosHttpService,
    CatastrosHttpService,
    CategoriasHttpService,
    ClasificacionesHttpService,
    DinardapHttpService,
    DpaHttpService,
    DpaService,
    EspecialistaZonalHttpService,
    EstablecimientosHttpService,
    EstablecimientosService,
    TramitesHttpService,
    ZonalesHttpService
} from '@services/siturin';
import { CatalogoSiturinTipoEnum, CatastroEstadoEnum, EstablecimientoEstadoEnum, InspeccionEstadoFechaEnum, RucEstadoEnum, TramiteEstadosEnum, TramiteTiposEnum } from '@shared/enums';
import { debounceTime } from 'rxjs';
import { Bind } from 'primeng/bind';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';
import { Paginator } from 'primeng/paginator';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Tag } from 'primeng/tag';
import { DatosSriComponent } from '../../../compartido/datos-sri/datos-sri.component';
import { DatosSuperciasComponent } from '../../../compartido/datos-supercias/datos-supercias.component';
import { Card } from 'primeng/card';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { Textarea } from 'primeng/textarea';
import { AlimentosBebidasInternoComponent } from '../../../compartido/actividades/alimentos-bebidas-interno/alimentos-bebidas-interno.component';
import { AlojamientoInternoComponent } from '../../../compartido/actividades/alojamiento-interno/alojamiento-interno.component';
import { OperacionIntermediacionInternoComponent } from '../../../compartido/actividades/operacion-intermediacion-interno/operacion-intermediacion-interno.component';
import { NormativaInternoComponent } from '../../../compartido/actividades/normativa-interno/normativa-interno.component';
import { Dialog } from 'primeng/dialog';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DatePicker } from 'primeng/datepicker';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { MultiSelect } from 'primeng/multiselect';
import { FileUpload } from 'primeng/fileupload';
import { Divider } from 'primeng/divider';
import { DiasRestantesPipe } from '@shared/pipes';
import { DiasRestantesColorPipe } from '@shared/pipes/siturin/dias-restantes-color.pipe';

import { Tabs } from 'primeng/tabs';
import { TabList } from 'primeng/tabs';
import { Tab } from 'primeng/tabs';
import { TabPanels } from 'primeng/tabs';
import { TabPanel } from 'primeng/tabs';
@Component({
    selector: 'app-tramite-list',
    templateUrl: './tramite-list.component.html',
    styleUrls: ['./tramite-list.component.scss'],
    imports: [
        Bind,
        Select,
        ReactiveFormsModule,
        ButtonDirective,
        Tooltip,
        Paginator,
        NgIf,
        TableModule,
        PrimeTemplate,
        InputText,
        Tag,
        DatosSriComponent,
        DatosSuperciasComponent,
        FormsModule,
        Card,
        LabelDirective,
        Textarea,
        NgFor,
        AlimentosBebidasInternoComponent,
        AlojamientoInternoComponent,
        OperacionIntermediacionInternoComponent,
        NormativaInternoComponent,
        Dialog,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        ToggleSwitch,
        DatePicker,
        ErrorMessageDirective,
        MultiSelect,
        FileUpload,
        Divider,
        AsyncPipe,
        DatePipe,
        DiasRestantesPipe,
        DiasRestantesColorPipe,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel
    ]
})
export class TramiteListComponent implements OnInit {
    @Output() tramiteSeleccionadoOutput: EventEmitter<number> = new EventEmitter<number>();

    private authService = inject(AuthService);
    private asignacionesHttpService = inject(AsignacionesHttpService);
    private catalogosSiturinService = inject(CatalogosSiturinService);
    private catastrosHttpService = inject(CatastrosHttpService);
    private catastroEstadosHttpService = inject(CatastroEstadosHttpService);
    private clasificacionesHttpService = inject(ClasificacionesHttpService);
    private categoriasHttpService = inject(CategoriasHttpService);
    private especialistaZonalHttpService = inject(EspecialistaZonalHttpService);
    private establecimientosHttpService = inject(EstablecimientosHttpService);
    private coreService = inject(CoreService);
    private coreHttpService = inject(CoreHttpService);
    private establecimientosService = inject(EstablecimientosService);
    private dpaHttpService = inject(DpaHttpService);
    private dpaService = inject(DpaService);
    private dinardapHttpService = inject(DinardapHttpService);
    private formBuilder = inject(FormBuilder);
    public messageService = inject(MessageService);
    private router = inject(Router);
    private tramitesHttpService = inject(TramitesHttpService);
    private zonalesHttpService = inject(ZonalesHttpService);

    columnasTabla: ColumnModel[] = [];
    columnasAsignacionesTabla: ColumnModel[] = this.configurarColumnasAsignacionesTabla();
    cargado$ = this.coreService.loaded$;
    paginadorTramitesNoAtendidos: PaginatorModel = this.coreService.paginator;
    paginadorTramitesAtendidos: PaginatorModel = this.coreService.paginator;
    paginadorTramitesSinAsignar: PaginatorModel = this.coreService.paginator;
    establecimientosSeleccionados: EstablecimientoModel[] = [];
    establecimientoSeleccionado: EstablecimientoModel = {};
    establecimientos: EstablecimientoModel[] = [];
    tramitesNoAtendidos: TramiteModel[] = [];
    tramitesAtendidos: TramiteModel[] = [];
    tramitesSinAsignar: TramiteModel[] = [];
    tramiteTipos: CatalogoModel[] = [];
    erroresEstablecimiento: string[] = [];
    tramitesSeleccionados: TramiteModel[] = [];
    tramiteSeleccionado: TramiteModel = {};
    motivoDevolucionTramite: FormControl = new FormControl(null, [Validators.required]);
    fechaAgendaTramite: FormControl = new FormControl(null, [Validators.required]);
    horaAgendaTramite: FormControl = new FormControl(new Date(), []);
    fechaConfirmada: FormControl = new FormControl(false, [Validators.required]);
    dialogoReasignarTramite: boolean = false;
    dialogoAgendarTramite: boolean = false;
    dialogoResultadoInspeccion: boolean = false;
    dialogoDescargas: boolean = false;
    dialogoHistorialAsignaciones: boolean = false;
    fechaActual: Date = new Date();
    fechaMaximaAgenda: Date = new Date('2100-12-31');
    asignaciones: AsignacionModel[] = [];
    catastroEstados: CatastroEstadoModel[] = [];
    catastroEstadosClon: CatastroEstadoModel[] = [];
    formularioEstadoInspeccion: FormGroup = this.nuevoEsatdoInspeccionFormulario;
    causalesIncumplimiento: CatalogoModel[] = [];
    archivo: any = null;
    categorias: CategoriaModel[] = [];
    clasificaciones: ClasificacionModel[] = [];
    descargas: any[] = [];
    archivos: FileModel[] = [];
    cargandoTramites: boolean = true;
    cargandoUsuariosInternos: boolean = false;
    dialogoTitulo: string = '';
    cargando: boolean = false;
    zonales: ZonalModel[] = [];
    dpa: DpaModel[] = [];
    zonalControl: FormControl = new FormControl<ZonalModel>({});
    dpaControl: FormControl = new FormControl<DpaModel>({});
    usuariosInternosDpa: UsuarioInternoDpaModel[] = [];
    usuarioInterno: FormControl = new FormControl<UsuarioInternoDpaModel>({});
    indiceTab: number = 0;
    cargandoTramiteSeleccionado: boolean = false;
    provincias: DpaModel[] = [];
    buscador: FormGroup = this.nuevoBuscadorFormulario;
    tiposFiltro: any[] = [];
    filtro: FormGroup = this.nuevoFiltroFormulario;

    constructor() {
        this.tiposFiltro = [
            { codigo: 'ruc', nombre: 'RUC' },
            { codigo: 'nombreComercial', nombre: 'Nombre Comercial' },
            { codigo: 'numeroRegistro', nombre: 'Número de Registro' }
        ];

        this.configurarColumnasTabla();

        this.fechaConfirmada.valueChanges.subscribe((value) => {
            let fechaInspeccion = new Date(this.tramiteSeleccionado.inspeccionActual?.fechaInspeccion!);
            if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA) {
                fechaInspeccion = new Date(this.tramiteSeleccionado.inspeccionActual?.fechaSolicitud!);
            }

            const fechaActual = new Date();
            fechaInspeccion.setHours(fechaActual.getHours());
            fechaInspeccion.setMinutes(fechaActual.getMinutes());
            fechaInspeccion.setSeconds(0);
            this.fechaAgendaTramite.setValue(fechaInspeccion);
        });

        this.horaAgendaTramite.valueChanges.subscribe((value: Date) => {
            const fechaInspeccion = new Date(this.fechaAgendaTramite.value);
            fechaInspeccion.setHours(value.getHours());
            fechaInspeccion.setMinutes(value.getMinutes());
            fechaInspeccion.setSeconds(0);

            this.fechaAgendaTramite.setValue(fechaInspeccion);
        });

        this.clasificacionField.valueChanges.subscribe((value) => {
            if (value?.id) this.obtenerCategoriasPorClasificacion(value.id);
        });

        this.catastroEstadoField.valueChanges.subscribe((value) => {
            this.configurarCamposObligatoriosEstadoInspeccion();
        });
    }

    ngOnInit(): void {
        this.zonales = this.authService.zonales;

        if (this.zonales.length > 0) {
            this.zonalControl.patchValue(this.zonales[0]);
            this.dpa = this.zonales[0].dpa!;
            if (this.dpa) {
                this.dpa = this.dpa.filter((x) => x.padreId == null);
            }
        }

        this.zonalControl.valueChanges.subscribe((value) => {
            this.dpaControl.patchValue(null);
            this.dpa = value.dpa!;
            if (this.dpa) this.dpa = this.dpa.filter((x) => x.padreId == null);
        });

        this.obtenerTramitesNoAtendidosPorZonal();
        this.obtenerTramitesSinAsignarPorZonal();
        // this.obtenerTramitesAtendidosPorZonal();
        // this.obtenerTramitesSinAsignarPorZonal();
        this.obtenerCatastroEstados();
        this.obtenerCuasalesIncumplimiento();

        this.valorField.valueChanges.pipe(debounceTime(1500)).subscribe((value) => {
            if (this.indiceTab === 0) this.obtenerTramitesNoAtendidosPorZonal(1, this.buscador.value);
            if (this.indiceTab === 1) this.obtenerTramitesAtendidosPorZonal(1, this.buscador.value);
            if (this.indiceTab === 2) this.obtenerTramitesSinAsignarPorZonal(1, this.buscador.value);
        });
    }

    get nuevoEsatdoInspeccionFormulario(): UntypedFormGroup {
        return this.formBuilder.group({
            catastroEstado: [null, [Validators.required]],
            causalesIncumplimiento: [[], []],
            formularioRequisitos: [null, []],
            formularioRequisitosIncumplimiento: [null, []],
            actaNotificacionTemporal: [null, []],
            actaNotificacionDefinitiva: [null, []],
            actaActualizacion: [null],
            categoria: [null, []],
            clasificacion: [null, []]
        });
    }

    get nuevoFiltroFormulario() {
        return this.formBuilder.group({
            actividad: [null],
            estado: [null],
            zonal: [null],
            dpa: [null]
        });
    }

    obtenerUsuariosInternosPorDpa(event: any) {
        this.cargandoUsuariosInternos = true;
        this.dpaHttpService.obtenerUsuariosInternosPorDpa(event.value?.id).subscribe(
            (usuariosInternos) => {
                this.cargandoUsuariosInternos = false;
                this.usuariosInternosDpa = usuariosInternos;
            },
            (error) => (this.cargandoUsuariosInternos = false)
        );
    }

    obtenerProvinciasPorZonal() {
        this.provincias = this.dpaService.obtenerProvinciasPorZonal(this.zonalControl.value?.id);
    }

    obtenerTramitesNoAtendidosPorZonal(page: number = 1, buscador: any = null) {
        if (this.zonalControl.value?.id) {
            this.cargandoTramites = true;
            this.tramiteSeleccionado = {};
            this.especialistaZonalHttpService.obtenerTramitesNoAtendidosPorZonal(this.zonalControl.value?.id, this.dpaControl.value?.id, page, buscador, this.filtro.value).subscribe(
                (response) => {
                    this.tramitesNoAtendidos = response.data;
                    this.paginadorTramitesNoAtendidos = response.meta;
                    this.cargandoTramites = false;
                },
                (error) => (this.cargandoTramites = false)
            );
        }
    }

    obtenerTramitesSinAsignarPorZonal(page: number = 1, buscador: any = null) {
        if (this.zonalControl.value?.id) {
            this.cargandoTramites = true;
            this.tramiteSeleccionado = {};
            this.especialistaZonalHttpService.obtenerTramitesSinAsignarPorZonal(this.zonalControl.value?.id, this.dpaControl.value?.id, page, buscador, this.filtro.value).subscribe(
                (response) => {
                    this.tramitesSinAsignar = response.data;
                    this.paginadorTramitesSinAsignar = response.meta;
                    if (this.tramitesSinAsignar?.length > 0) {
                        this.messageService.getWarningCustom('Existen trámites sin asignar', 'Por favor reasigne los trámites');
                    }

                    this.cargandoTramites = false;
                },
                (error) => (this.cargandoTramites = false)
            );
        }
    }

    obtenerTramitesAtendidosPorZonal(page: number = 1, buscador: any = null) {
        if (this.authService.usuarioInterno?.id) {
            this.cargandoTramites = true;
            this.tramiteSeleccionado = {};
            this.especialistaZonalHttpService.obtenerTramitesAtendidosPorZonal(this.zonalControl.value?.id, this.dpaControl.value?.id, page, buscador, this.filtro.value).subscribe((response) => {
                this.tramitesAtendidos = response.data;
                this.paginadorTramitesAtendidos = response.meta;
                this.cargandoTramites = false;
            });
        }
    }

    reasignarTramite() {
        // if (this.authService.usuarioInterno?.id) {
        // this.tramitesHttpService.obtenerTramitesPorUsuarioInterno(this.authService.usuarioInterno.id)
        this.asignacionesHttpService.reasignarTramiteTecnicoZonal(this.tramiteSeleccionado.id!, this.usuarioInterno.value?.usuarioInterno?.id, { observaciones: [`${this.motivoDevolucionTramite.value}`] }).subscribe(
            (tramite) => {
                this.dialogoReasignarTramite = false;
                this.obtenerTramitesSinAsignarPorZonal();
                this.tramiteSeleccionado = {};
                this.tramiteSeleccionadoOutput.emit(0);
            },
            (error) => (this.dialogoReasignarTramite = false)
        );
        // }
    }

    agendarTramite() {
        if (this.authService.usuarioInterno?.id) {
            let fechaInspeccion = '';
            if (this.fechaConfirmada.value) {
                const fecha = new Date(this.fechaAgendaTramite.value);
                const horas = format(fecha, 'hh');
                const minutos = format(fecha, 'mm');

                fecha.setHours(parseInt(horas));
                fecha.setMinutes(parseInt(minutos));

                fechaInspeccion = format(fecha, 'yyyy-MM-dd hh:mm:ss');
            } else {
                fechaInspeccion = format(this.fechaAgendaTramite.value, 'yyyy-MM-dd HH:mm:ss');
            }

            this.tramitesHttpService
                .agendarTramiteUsuarioInterno(this.tramiteSeleccionado.id!, {
                    fechaInspeccion,
                    confirmada: this.fechaConfirmada.value,
                    usuarioInterno: this.authService.usuarioInterno
                })
                .subscribe(
                    (tramite) => {
                        this.dialogoAgendarTramite = false;
                        this.obtenerTramitesNoAtendidosPorZonal();
                    },
                    (error) => (this.dialogoAgendarTramite = false)
                );
        }
    }

    guardarEstadoInspeccion() {
        const formData = new FormData();
        formData.append('clasificacionId', JSON.stringify(this.clasificacionField.value?.id));
        formData.append('categoriaId', JSON.stringify(this.categoriaField.value?.id));
        formData.append('usuarioInterno', JSON.stringify(this.authService.usuarioInterno));
        formData.append('catastroEstado', JSON.stringify(this.catastroEstadoField.value));
        formData.append('causalesIncumplimiento', JSON.stringify(this.causalesIncumplimientoField.value));
        formData.append('formularioRequisitos', this.formularioRequisitosField.value);
        formData.append('actaNotificacionTemporal', this.actaNotificacionTemporalField.value);
        formData.append('actaNotificacionDefinitiva', this.actaNotificacionDefinitivaField.value);

        this.tramitesHttpService.guardarEstadoInspeccion(this.tramiteSeleccionado.id!, formData).subscribe(
            (response) => {
                this.obtenerTramitesNoAtendidosPorZonal();
                this.dialogoResultadoInspeccion = false;
            },
            (error) => (this.dialogoResultadoInspeccion = false)
        );
    }

    configurarColumnasTabla() {
        this.columnasTabla = [
            { field: 'catastro', header: 'Número de Registro' },
            { field: 'establecimientoNumero', header: 'Código del Establecimiento' },
            { field: 'establecimiento', header: 'Nombre Comercial' },
            { field: 'establecimiento', header: 'Ubicación' },
            { field: 'actividad', header: 'Actividad' },
            { field: 'clasificacion', header: 'Clasificación/Categoría' },
            { field: 'estado', header: 'Estado' },
            { field: 'tramite', header: 'Trámite' },
            { field: 'inspeccion', header: 'Tiempo Transcurrido' },
            { field: 'inspeccion', header: 'Fecha Inspección' },
            { field: 'inspeccion', header: 'Estado Inspección' }
        ];
    }

    mostrarDialogoHistorialAsignaciones() {
        if (!this.tramiteSeleccionado?.id) {
            this.messageService.getErrorsCustom('Debe seleccionar un trámite', 'Por favor seleccione un trámite');
            return;
        }

        this.dialogoTitulo = `Historial Asignaciones -
    ${this.tramiteSeleccionado.establecimiento?.nombreComercial}
    ${this.tramiteSeleccionado.actividad?.nombre} /
    ${this.tramiteSeleccionado.clasificacion?.nombre}  /
    ${this.tramiteSeleccionado.categoria?.nombre}`;

        this.obtenerAsignacionesPorTramite();
        this.dialogoHistorialAsignaciones = true;
    }

    mostrarDialogoReasignarTramite() {
        if (!this.tramiteSeleccionado?.id) {
            this.messageService.getErrorsCustom('Debe seleccionar un trámite', 'Por favor seleccione un trámite');
            return;
        }

        // this.obtenerUsuariosInternosPorZonal();
        this.obtenerProvinciasPorZonal();

        this.dialogoTitulo = `Asignación de trámite -
    ${this.tramiteSeleccionado.establecimiento?.nombreComercial}
    ${this.tramiteSeleccionado.actividad?.nombre} /
    ${this.tramiteSeleccionado.clasificacion?.nombre}  /
    ${this.tramiteSeleccionado.categoria?.nombre}`;
        this.motivoDevolucionTramite.reset();

        this.dialogoReasignarTramite = true;
    }

    mostrarDialogoAgendarTramite() {
        if (!this.tramiteSeleccionado?.id) {
            this.messageService.getErrorsCustom('Debe seleccionar un trámite', 'Por favor seleccione un trámite');
            return;
        }

        this.dialogoTitulo = `Agendar Trámite -
    ${this.tramiteSeleccionado.establecimiento?.nombreComercial}
    ${this.tramiteSeleccionado.actividad?.nombre} /
    ${this.tramiteSeleccionado.clasificacion?.nombre}  /
    ${this.tramiteSeleccionado.categoria?.nombre}`;

        this.fechaConfirmada.setValue(false);
        this.fechaAgendaTramite.setValue(null);
        let fechaInspeccion = new Date(this.tramiteSeleccionado.inspeccionActual?.fechaInspeccion!);
        if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA) {
            fechaInspeccion = new Date(this.tramiteSeleccionado.inspeccionActual?.fechaSolicitud!);
        }

        fechaInspeccion.setHours(12);
        fechaInspeccion.setMinutes(0);
        fechaInspeccion.setSeconds(0);

        if (differenceInDays(new Date(), fechaInspeccion) >= 0) {
            this.fechaActual = new Date();
        } else {
            this.fechaActual = fechaInspeccion;
        }

        this.fechaMaximaAgenda = new Date('2100-12-31');

        if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_2) {
            this.messageService.getErrorsCustom('Ya no puede volver a reagendar', 'Ya se ha reagendado en 2 ocasiones');
            return;
        }

        if (this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_1) {
            if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
                this.fechaMaximaAgenda = new Date('2100-12-31');
            }

            if (
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION
            ) {
                if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA && this.obtenerDiferenciaFechas(this.tramiteSeleccionado.inspeccionActual.fechaInspeccion) <= 0) {
                    this.messageService.getErrorsCustom('No se cumplen los días mínimos', 'Por favor espere a que se cumpla o el usuario solicite la primera inspección');
                    return;
                }

                if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.CONFIRMADA || this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_1) {
                    this.fechaMaximaAgenda = addBusinessDays(new Date(this.tramiteSeleccionado.inspeccionActual.fechaInspeccion!), 5);
                }
            }
        }

        if (this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2) {
            if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION) {
                if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA) {
                    this.messageService.getErrorsCustom('No se puede agendar', 'Mientras el usuario externo no solicite fecha de inspección');
                    return;
                }

                if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.CONFIRMADA || this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_1) {
                    this.fechaMaximaAgenda = addBusinessDays(new Date(this.tramiteSeleccionado.inspeccionActual.fechaInspeccion!), 5);
                }
            }
        }

        this.dialogoAgendarTramite = true;
    }

    mostrarDialogoResultadoInspeccion() {
        if (!this.tramiteSeleccionado?.id) {
            this.messageService.getErrorsCustom('Debe seleccionar un trámite', 'Por favor seleccione un trámite');
            return;
        }

        if (this.obtenerDiferenciaFechas(this.tramiteSeleccionado.inspeccionActual?.fechaInspeccion) < 0) {
            this.messageService.getErrorsCustom('No puede cambiar el estado de inspección', 'La fecha de inspección es mayor a la actual');
            return;
        }

        if (
            this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2 &&
            this.obtenerDiferenciaFechas(this.tramiteSeleccionado.inspeccionActual?.fechaInspeccion) <= 0 &&
            this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA
        ) {
            this.messageService.getErrorsCustom('No puede cambiar el estado de inspección', 'El usuario debe solicitar o esperar a que se cumpla el tiempo establecido');
            return;
        }

        if (
            this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_1 &&
            (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA || this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA)
        ) {
            this.messageService.getErrorsCustom('No puede cambiar el estado de inspección', 'Debe agendar, confirmar o reagendar');
            return;
        }

        if (this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2 && this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA) {
            this.messageService.getErrorsCustom('No puede cambiar el estado de inspección', 'Debe agendar, confirmar o reagendar');
            return;
        }

        this.dialogoTitulo = `Resultado Inspección -
    ${this.tramiteSeleccionado.establecimiento?.nombreComercial}
    ${this.tramiteSeleccionado.actividad?.nombre} /
    ${this.tramiteSeleccionado.clasificacion?.nombre}  /
    ${this.tramiteSeleccionado.categoria?.nombre}`;

        this.formularioEstadoInspeccion.reset();
        this.configurarCatastroEstados();
        this.removerTodosArchivos();
        // this.configurarCamposObligatoriosEstadoInspeccion();
        this.obtenerCategoriasPorClasificacion(this.tramiteSeleccionado.clasificacion?.id!);
        this.obtenerClasificacionesPorActividad();
        this.dialogoResultadoInspeccion = true;
    }

    mostrarDialogoDescargas() {
        if (!this.tramiteSeleccionado?.id) {
            this.messageService.getErrorsCustom('Debe seleccionar un trámite', 'Por favor seleccione un trámite');
            return;
        }

        this.dialogoTitulo = `Descargas -
    ${this.tramiteSeleccionado.establecimiento?.nombreComercial}
    ${this.tramiteSeleccionado.actividad?.nombre} /
    ${this.tramiteSeleccionado.clasificacion?.nombre}  /
    ${this.tramiteSeleccionado.categoria?.nombre}`;

        this.descargas = [];
        if (this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_1) {
            if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
                this.descargas.push({ codigo: 'acta_actualizacion', nombre: 'Acta de Actualización' });
            }

            if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION) {
                this.descargas.push({ codigo: 'check_list', nombre: 'Check List' });
            }

            if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION) {
                this.descargas.push({ codigo: 'acta_suspension_temporal', nombre: 'Acta de Suspensión Temporal' });
                this.descargas.push({ codigo: 'check_list', nombre: 'Check List' });
            }
        }

        if (this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2) {
            this.descargas.push({ codigo: 'acta_suspension_definitiva', nombre: 'Acta de Suspensión Definitiva' });
            this.descargas.push({ codigo: 'check_list', nombre: 'Check List' });
        }
        this.obtenerArchivosInspecciones();
        this.dialogoDescargas = true;
    }

    configurarColumnasAsignacionesTabla() {
        return [
            { field: 'tramite', header: 'Estado' },
            { field: 'fecha', header: 'Fecha' },
            { field: 'usuarioInterno', header: 'Funcionario' },
            { field: 'observaciones', header: 'Observaciones' }
        ];
    }

    obtenerAsignacionesPorTramite() {
        this.asignacionesHttpService.obtenerAsignacionesPorTramite(this.tramiteSeleccionado?.id!).subscribe((asignaciones) => {
            this.asignaciones = asignaciones;
        });
    }

    obtenerCuasalesIncumplimiento() {
        this.causalesIncumplimiento = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.CAUSALES_INCUMPLIMIENTO);
    }

    obtenerCategoriasPorClasificacion(clasificacionId: number) {
        this.categoriasHttpService.obtenerCategoriasPorClasificacion(clasificacionId).subscribe((categorias) => {
            this.categorias = categorias;
        });
    }

    obtenerClasificacionesPorActividad() {
        this.clasificacionesHttpService.obtenerClasificacionesPorActividad(this.tramiteSeleccionado.actividad?.id!).subscribe((clasificaciones) => {
            this.clasificaciones = clasificaciones;
        });
    }

    descargarArchivo(archivo: FileModel) {
        this.coreHttpService.downloadFile(archivo);
    }

    obtenerArchivosInspecciones() {
        this.tramitesHttpService.obtenerArchivosInspecciones(this.tramiteSeleccionado.id!).subscribe((archivos) => {
            this.archivos = archivos;
        });
    }

    cargarArchivoFormularioRequisitos(event: any) {
        if (event.files.length) {
            this.formularioRequisitosField.patchValue(event.files[0]);
            this.archivo = event.files[0];
        }
    }

    cargarArchivoFormularioRequisitosIncumplimiento(event: any) {
        if (event.files.length) {
            this.formularioRequisitosIncumplimientoField.patchValue(event.files[0]);
            this.archivo = event.files[0];
        }
    }

    cargarArchivoActaNotificacionTemporal(event: any) {
        if (event.files.length) {
            this.actaNotificacionTemporalField.patchValue(event.files[0]);
        }
    }

    cargarArchivoActualizacion(event: any) {
        if (event.files.length) {
            this.actaActualizacionField.patchValue(event.files[0]);
        }
    }

    cargarArchivoActaNotificacionDefinitiva(event: any) {
        if (event.files.length) {
            this.actaNotificacionDefinitivaField.patchValue(event.files[0]);
        }
    }

    obtenerOpcionesTramites(establecimiento: EstablecimientoModel): CatalogoModel[] {
        const opciones: CatalogoModel[] = [];
        const opcion = this.tramiteTipos.find((tipoTramite) => tipoTramite.codigo === TramiteTiposEnum.REGISTRO);
        opciones.push(opcion!);
        return opciones;
        if (
            establecimiento.ruc?.estado?.codigo === RucEstadoEnum.ACTIVO &&
            establecimiento.estado?.codigo === EstablecimientoEstadoEnum.CERRADO &&
            establecimiento.tramiteActual?.catastro?.estado?.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA
        ) {
            opciones.push({ codigo: 'inactivar', nombre: 'Inactivar' });
            return opciones;
        }

        if (establecimiento.ruc?.estado?.codigo === RucEstadoEnum.SUSPENDIDO && establecimiento.tramiteActual?.catastro?.numeroRegistro != '') {
            opciones.push({ codigo: 'inactivar', nombre: 'Inactivar' });
            return opciones;
        }

        if (establecimiento.ruc?.estado?.codigo === RucEstadoEnum.ACTIVO && establecimiento.estado?.codigo === EstablecimientoEstadoEnum.ABIERTO && establecimiento.tramiteActual?.catastro?.numeroRegistro != '') {
            opciones.push({ codigo: 'inactivar', nombre: 'Inactivar' });
            return opciones;
        }

        return [];
    }

    seleccionarTramite(event: any) {
        this.cargandoTramiteSeleccionado = true;
        this.tramiteSeleccionado = {};
        this.tramitesHttpService.obtenerTramiteCatastroSeleccionado(event.data.id).subscribe(
            (tramite) => {
                this.tramiteSeleccionado = tramite;
                this.cargandoTramiteSeleccionado = false;
            },
            (error) => {
                this.cargandoTramiteSeleccionado = false;
            }
        );
    }

    quitarSeleccionarTramite(event: any) {
        this.tramiteSeleccionado = {};
        this.asignaciones = [];
    }

    obtenerCatastroEstados() {
        this.catastroEstadosHttpService.obtenerCatastroEstados().subscribe((catastroEstados) => {
            this.catastroEstados = catastroEstados;
            this.catastroEstadosClon = catastroEstados;
        });
    }

    configurarCatastroEstados() {
        if (
            this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_1 &&
            (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION)
        ) {
            this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO || catastroEstado.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL);
        }

        if (
            this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2 &&
            this.obtenerDiferenciaFechas(this.tramiteSeleccionado.inspeccionActual?.fechaInspeccion) <= 0 &&
            (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION)
        ) {
            this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO || catastroEstado.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA);
        }

        if (this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2 && this.obtenerDiferenciaFechas(this.tramiteSeleccionado.inspeccionActual?.fechaInspeccion) > 0) {
            this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA);
        }

        if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
            this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO);
        }

        if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION) {
            this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO || catastroEstado.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO);
        }

        if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION) {
            this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO || catastroEstado.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO);
        }
    }

    configurarCamposObligatoriosEstadoInspeccion() {
        this.catastroEstadoField.setValidators(Validators.required);
        this.clasificacionField.setValidators(null);
        this.categoriaField.setValidators(null);
        this.causalesIncumplimientoField.setValidators(null);
        this.formularioRequisitosField.setValidators(null);
        this.formularioRequisitosIncumplimientoField.setValidators(null);
        this.actaActualizacionField.setValidators(null);
        this.actaNotificacionTemporalField.setValidators(null);
        this.actaNotificacionDefinitivaField.setValidators(null);

        if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION && this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO) {
            this.clasificacionField.setValidators(Validators.required);
            this.clasificacionField.updateValueAndValidity();
        }

        if (
            (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION) &&
            (this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO || this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO)
        ) {
            this.categoriaField.setValidators(Validators.required);
            this.categoriaField.updateValueAndValidity();
        }

        if (this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL) {
            this.causalesIncumplimientoField.setValidators(Validators.required);
            this.causalesIncumplimientoField.updateValueAndValidity();
        }

        if (this.tramiteSeleccionado.tipo?.codigo !== TramiteTiposEnum.ACTUALIZACION) {
            this.formularioRequisitosField.setValidators(Validators.required);
            this.formularioRequisitosField.updateValueAndValidity();
        }

        if (this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO || this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO) {
            this.formularioRequisitosIncumplimientoField.setValidators(Validators.required);
            this.formularioRequisitosIncumplimientoField.updateValueAndValidity();
        }

        if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
            this.actaActualizacionField.setValidators(Validators.required);
            this.actaActualizacionField.updateValueAndValidity();
        }

        if (this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL) {
            this.actaNotificacionTemporalField.setValidators(Validators.required);
            this.actaNotificacionTemporalField.updateValueAndValidity();
        }

        if (this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA) {
            this.actaNotificacionDefinitivaField.setValidators(Validators.required);
            this.actaNotificacionDefinitivaField.updateValueAndValidity();
        }
    }

    obtenerDiferenciaFechas(fechaInspeccion: Date | string | undefined): any {
        if (fechaInspeccion) {
            const diferencia = formatDistanceStrict(new Date(fechaInspeccion), new Date(), { unit: 'day', addSuffix: true });
            if (diferencia.search('in') > -1) {
                return -1 * parseInt(diferencia.split(' ')[1]);
            } else {
                return parseInt(diferencia.split(' ')[0]);
            }
        }

        return '';
    }

    removerArchivoActualizacion() {
        this.actaActualizacionField.setValue(null);
    }

    removerArchivoActaNotificacionTemporal() {
        this.actaNotificacionTemporalField.setValue(null);
    }

    removerArchivoActaNotificacionDefinitiva() {
        this.actaNotificacionDefinitivaField.setValue(null);
    }

    removerArchivoFormularioRequisitos() {
        this.formularioRequisitosField.setValue(null);
    }

    removerArchivoFormularioRequisitosIncumplimiento() {
        this.formularioRequisitosIncumplimientoField.setValue(null);
    }

    removerTodosArchivos() {
        this.removerArchivoActualizacion();
        this.removerArchivoActaNotificacionTemporal();
        this.removerArchivoActaNotificacionDefinitiva();
        this.removerArchivoFormularioRequisitos();
        this.removerArchivoFormularioRequisitosIncumplimiento();
    }

    descargarDocumento(archivo: any) {
        if (this.tramiteSeleccionado.catastro) {
            this.cargando = true;
            this.catastrosHttpService.obtenerDocumento(this.tramiteSeleccionado.catastro.id!, archivo.codigo).subscribe(
                (documento) => {
                    this.coreService.descargarDocumentoPDF(documento, archivo.codigo + '_' + this.tramiteSeleccionado.catastro?.numeroRegistro);
                    this.cargando = false;
                },
                (error) => (this.cargando = false)
            );
        }
    }

    descargarBandeja() {
        this.especialistaZonalHttpService.generarReporteTramitesPorZonalXLSX(this.zonalControl.value.id!);
    }

    recargarTramites(indiceTab: number) {
        if (indiceTab === 0) {
            this.obtenerTramitesNoAtendidosPorZonal();
        }

        if (indiceTab === 1) {
            this.obtenerTramitesAtendidosPorZonal();
        }

        if (indiceTab === 2) {
            this.obtenerTramitesSinAsignarPorZonal();
        }
    }

    paginar(event: any) {
        if (this.buscador.value) {
            if (this.indiceTab === 0) {
                this.obtenerTramitesNoAtendidosPorZonal(event.page + 1, this.buscador.value);
            }
            if (this.indiceTab === 1) {
                this.obtenerTramitesAtendidosPorZonal(event.page + 1, this.buscador.value);
            }
            if (this.indiceTab === 2) {
                this.obtenerTramitesSinAsignarPorZonal(event.page + 1, this.buscador.value);
            }
        } else {
            if (this.indiceTab === 0) {
                this.obtenerTramitesNoAtendidosPorZonal(event.page + 1);
            }
            if (this.indiceTab === 1) {
                this.obtenerTramitesAtendidosPorZonal(event.page + 1);
            }
            if (this.indiceTab === 2) {
                this.obtenerTramitesSinAsignarPorZonal(event.page + 1);
            }
        }
    }

    get nuevoBuscadorFormulario() {
        return this.formBuilder.group({
            tipo: [null],
            valor: [null]
        });
    }

    get catastroEstadoField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['catastroEstado'];
    }

    get formularioRequisitosField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['formularioRequisitos'];
    }

    get formularioRequisitosIncumplimientoField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['formularioRequisitosIncumplimiento'];
    }

    get causalesIncumplimientoField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['causalesIncumplimiento'];
    }

    get actaNotificacionTemporalField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['actaNotificacionTemporal'];
    }

    get actaActualizacionField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['actaActualizacion'];
    }

    get actaNotificacionDefinitivaField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['actaNotificacionDefinitiva'];
    }

    get clasificacionField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['clasificacion'];
    }

    get categoriaField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['categoria'];
    }

    get tipoField() {
        return this.buscador.controls['tipo'];
    }

    get valorField() {
        return this.buscador.controls['valor'];
    }
}
