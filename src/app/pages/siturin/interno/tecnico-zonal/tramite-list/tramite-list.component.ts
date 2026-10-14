import { Component, EventEmitter, OnInit, Output ,inject} from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { addBusinessDays, addDays, differenceInDays, format, formatDistanceStrict, isAfter } from 'date-fns';
import { ColumnModel, FileModel, PaginatorModel } from '@models/core';
import { AsignacionModel, CatalogoModel, CatastroEstadoModel, CategoriaModel, ClasificacionModel, EstablecimientoModel, TramiteModel } from '@models/siturin';
import { AuthService } from '@services/auth';
import {
    AsignacionesHttpService,
    CatalogosSiturinHttpService,
    CatalogosSiturinService,
    CatastroEstadosHttpService,
    CategoriasHttpService,
    ClasificacionesHttpService,
    DinardapHttpService,
    EstablecimientosHttpService,
    EstablecimientosService,
    TecnicoZonalHttpService,
    TramitesHttpService
} from '@services/siturin';
import { CoreHttpService, CoreService, MessageService } from '@services/core';
import { CatalogoSiturinTipoEnum, CatastroEstadoEnum, EstablecimientoEstadoEnum, InspeccionEstadoFechaEnum, RucEstadoEnum } from '@shared/enums';
import { TramiteEstadosEnum, TramiteTiposEnum } from '@shared/enums/siturin/tramite.enum';
import { CatastrosHttpService } from '@services/siturin/catastros-http.service';
import { debounceTime } from 'rxjs';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe } from '@angular/common';
import { Bind } from 'primeng/bind';
import { ButtonDirective } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Tooltip } from 'primeng/tooltip';
import { Paginator } from 'primeng/paginator';
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
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { Ripple } from 'primeng/ripple';
import { MultiSelect } from 'primeng/multiselect';
import { FileUpload } from 'primeng/fileupload';
import { InactivacionComponent } from '../../../externo/proceso-acreditacion/inactivacion/inactivacion.component';
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
        NgIf,
        Bind,
        ButtonDirective,
        Divider,
        Tooltip,
        Paginator,
        TableModule,
        PrimeTemplate,
        ReactiveFormsModule,
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
        ErrorMessageDirective,
        ToggleSwitch,
        DatePicker,
        Select,
        Ripple,
        MultiSelect,
        FileUpload,
        InactivacionComponent,
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
    public authService = inject(AuthService);
    private asignacionesHttpService = inject(AsignacionesHttpService);
    private catalogosSiturinService = inject(CatalogosSiturinService);
    private catastrosHttpService = inject(CatastrosHttpService);
    private catastroEstadosHttpService = inject(CatastroEstadosHttpService);
    private clasificacionesHttpService = inject(ClasificacionesHttpService);
    private categoriasHttpService = inject(CategoriasHttpService);
    private establecimientosHttpService = inject(EstablecimientosHttpService);
    private coreService = inject(CoreService);
    private coreHttpService = inject(CoreHttpService);
    private establecimientosService = inject(EstablecimientosService);
    private dinardapHttpService = inject(DinardapHttpService);
    private formBuilder = inject(FormBuilder);
    public messageService = inject(MessageService);
    private router = inject(Router);
    private tecnicoZonalHttpService = inject(TecnicoZonalHttpService);
    private tramitesHttpService = inject(TramitesHttpService);
    columnasAsignacionesTabla = ([] = this.configurarColumnasAsignacionesTabla());
    cargado$ = this.coreService.loaded$;
    paginadorTramitesAntendidos: PaginatorModel = this.coreService.paginator;
    paginadorTramitesNoAtendidos: PaginatorModel = this.coreService.paginator;
    buscador: FormControl = new FormControl('');
    establecimientosSeleccionados: EstablecimientoModel[] = [];
    establecimientoSeleccionado: EstablecimientoModel = {};
    establecimientos: EstablecimientoModel[] = [];
    tramites: TramiteModel[] = [];
    tramitesAtendidos: TramiteModel[] = [];
    tramiteTipos: CatalogoModel[] = [];
    erroresEstablecimiento: string[] = [];
    tramitesSeleccionados: TramiteModel[] = [];
    tramiteSeleccionado: TramiteModel = {};
    motivoDevolucionTramite: FormControl = new FormControl(null, [Validators.required]);
    fechaAgendaTramite: FormControl = new FormControl(null, [Validators.required]);
    horaAgendaTramite: FormControl = new FormControl(new Date(), []);
    fechaConfirmada: FormControl = new FormControl(false, [Validators.required]);
    dialogoDevolverTramite: boolean = false;
    dialogoAgendarTramite: boolean = false;
    dialogoResultadoInspeccion: boolean = false;
    dialogoDescargas: boolean = false;
    dialogoHistorialAsignaciones: boolean = false;
    dialogoCausalesInactivacion: boolean = false;
    dialogoFormatosChecklist: boolean = false;
    fechaActual: Date = new Date();
    fechaMaximaAgenda: Date = new Date('2100-12-31');
    asignaciones: AsignacionModel[] = [];
    catastroEstados: CatastroEstadoModel[] = [];
    catastroEstadosClon: CatastroEstadoModel[] = [];
    formularioEstadoInspeccion: FormGroup = this.nuevoEsatdoInspeccionFormulario;
    causalesIncumplimiento: CatalogoModel[] = [];
    causalesInactivacionInterno: CatalogoModel[] = [];
    archivo: any = null;
    categorias: CategoriaModel[] = [];
    clasificaciones: ClasificacionModel[] = [];
    descargas: any[] = [];
    archivos: FileModel[] = [];
    cargandoTramites: boolean = true;
    dialogoTitulo: string = '';
    cargando: boolean = false;
    cargandoTramiteSeleccionado: boolean = false;
    observacionesActualizacion: string[] = ['El establecimiento cumple con la normativa vigente', 'Fue necesario actualizar la ubicación'];
    indiceTab: number = 0;
    hrefFormatChecklist: string = '';

    constructor(
    ) {
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

        this.buscador.valueChanges.pipe(debounceTime(1500)).subscribe((value) => {
            if (this.indiceTab === 0) this.obtenerTramitesNoAtendidosPorUsuarioInterno(1, this.buscador.value);
            if (this.indiceTab === 1) this.obtenerTramitesAtendidosPorUsuarioInterno(1, this.buscador.value);
        });
    }

    ngOnInit(): void {
        this.obtenerCuasalesIncumplimiento();
        this.obtenerCuasalesIncumplimientoInactivacion();
        this.obtenerTramitesNoAtendidosPorUsuarioInterno();
        this.obtenerCatastroEstados();

        this.catastroEstadoField.valueChanges.subscribe((value) => {
            this.configurarCamposObligatoriosEstadoInspeccion();
        });

        this.formularioEstadoInspeccion.valueChanges.subscribe(() => {
            // console.log(this.formularioEstadoInspeccion);
        });
    }

    get nuevoEsatdoInspeccionFormulario(): UntypedFormGroup {
        return this.formBuilder.group({
            catastroEstado: [null, [Validators.required]],
            causalesInactivacion: [[], []],
            causalesIncumplimiento: [[], []],
            formularioRequisitos: [null, []],
            formularioRequisitosIncumplimiento: [null, []],
            formularioRequisitosInactivacion: [null, []],
            actaNotificacionTemporal: [null, []],
            actaNotificacionDefinitiva: [null, []],
            actaActualizacion: [null],
            categoria: [null, []],
            clasificacion: [null, []],
            observacionesActualizacion: [[], []]
        });
    }

    obtenerTramiteTipos() {
        this.tramiteTipos = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TRAMITE_TIPOS);
    }

    get nuevoBuscadorFormulario() {
        return this.formBuilder.group({
            tipo: [null],
            valor: [null]
        });
    }

    obtenerTramitesNoAtendidosPorUsuarioInterno(page: number = 1, buscador: any = null) {
        if (this.authService.usuarioInterno?.id) {
            this.cargandoTramites = true;
            this.tramiteSeleccionado = {};
            this.tecnicoZonalHttpService.obtenerTramitesNoAtendidosPorUsuarioInterno(this.authService.usuarioInterno.id, page, buscador).subscribe(
                (response) => {
                    this.tramites = response.data;
                    this.paginadorTramitesNoAtendidos = response.meta;
                    this.cargandoTramites = false;
                },
                (error) => (this.cargandoTramites = false)
            );
        }
    }

    obtenerTramitesAtendidosPorUsuarioInterno(page: number = 1, buscador: any = null) {
        if (this.authService.usuarioInterno?.id) {
            this.cargandoTramites = true;
            this.tramiteSeleccionado = {};
            this.tecnicoZonalHttpService.obtenerTramitesAtendidosPorUsuarioInterno(this.authService.usuarioInterno.id, page, buscador).subscribe((response) => {
                this.tramitesAtendidos = response.data;
                this.paginadorTramitesAntendidos = response.meta;
                this.cargandoTramites = false;
            });
        }
    }

    devolverTramite() {
        // if (this.authService.usuarioInterno?.id) {
        // this.tramitesHttpService.obtenerTramitesPorUsuarioInterno(this.authService.usuarioInterno.id)
        this.tramitesHttpService.devolverTramite(this.tramiteSeleccionado.id!, { observaciones: [`${this.motivoDevolucionTramite.value}`] }).subscribe(
            (tramite) => {
                this.dialogoDevolverTramite = false;
                this.obtenerTramitesNoAtendidosPorUsuarioInterno();
                this.tramiteSeleccionado = {};
                this.tramiteSeleccionadoOutput.emit(0);
            },
            (error) => (this.dialogoDevolverTramite = false)
        );
        // }
    }

    agendarTramite() {
        this.dialogoAgendarTramite = false;

        this.messageService
            .questionCustom(`${format(this.fechaAgendaTramite.value, 'yyyy-MM-dd / HH:mm:ss')}`, `¿La fecha ingresada es correcta?, por favor dar clic en “Aceptar”, caso contrario en “Cancelar”. Por favor revise su agenda`, 'Aceptar')
            .then((result) => {
                if (result.isConfirmed) {
                    if (this.authService.usuarioInterno?.id) {
                        let fechaInspeccion = '';
                        if (this.fechaConfirmada.value) {
                            const fecha = new Date(this.fechaAgendaTramite.value);
                            const horas = format(fecha, 'HH');
                            const minutos = format(fecha, 'mm');

                            fecha.setHours(parseInt(horas));
                            fecha.setMinutes(parseInt(minutos));

                            fechaInspeccion = format(fecha, 'yyyy-MM-dd HH:mm:ss');
                        } else {
                            fechaInspeccion = format(this.fechaAgendaTramite.value, 'yyyy-MM-dd HH:mm:ss');
                        }

                        this.cargandoTramites = true;
                        this.tramitesHttpService
                            .agendarTramiteUsuarioInterno(this.tramiteSeleccionado.id!, {
                                fechaInspeccion,
                                confirmada: this.fechaConfirmada.value,
                                usuarioInterno: this.authService.usuarioInterno
                            })
                            .subscribe(
                                (tramite) => {
                                    this.dialogoAgendarTramite = false;
                                    this.cargandoTramites = false;
                                    this.obtenerTramitesNoAtendidosPorUsuarioInterno();
                                    this.horaAgendaTramite.setValue(new Date());
                                },
                                (error) => {
                                    this.dialogoAgendarTramite = false;
                                    this.cargandoTramites = false;
                                }
                            );
                    }
                }
            });
    }

    guardarEstadoInspeccion() {
        const formData = new FormData();
        formData.append('clasificacionId', JSON.stringify(this.clasificacionField.value?.id));
        formData.append('categoriaId', JSON.stringify(this.categoriaField.value?.id));
        formData.append('usuarioInternoId', JSON.stringify(this.authService.usuarioInterno.id));
        formData.append('catastroEstado', JSON.stringify(this.catastroEstadoField.value));
        formData.append('causalesIncumplimiento', JSON.stringify(this.causalesIncumplimientoField.value));
        formData.append('causalesInactivacion', JSON.stringify(this.causalesInactivacionField.value));
        formData.append('formularioRequisitos', this.formularioRequisitosField.value);
        formData.append('formularioRequisitosIncumplimiento', this.formularioRequisitosIncumplimientoField.value);
        formData.append('formularioRequisitosInactivacion', this.formularioRequisitosInactivacionField.value);
        formData.append('actaNotificacionTemporal', this.actaNotificacionTemporalField.value);
        formData.append('actaNotificacionDefinitiva', this.actaNotificacionDefinitivaField.value);
        formData.append('actaActualizacion', this.actaActualizacionField.value);
        formData.append('observacionesActualizacion', this.observacionesActualizacionField.value);

        this.cargando = true;
        this.tramitesHttpService.guardarEstadoInspeccion(this.tramiteSeleccionado.id!, formData).subscribe(
            (response) => {
                this.obtenerTramitesNoAtendidosPorUsuarioInterno();
                this.dialogoResultadoInspeccion = false;
                this.cargando = false;
            },
            (error) => {
                this.dialogoResultadoInspeccion = false;
                this.cargando = false;
            }
        );
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

    mostrarDialogoInactivacion() {
        if (!this.tramiteSeleccionado?.id) {
            this.messageService.getErrorsCustom('Debe seleccionar un trámite', 'Por favor seleccione un trámite');
            return;
        }

        this.dialogoTitulo = `Inactivación -
    ${this.tramiteSeleccionado.establecimiento?.nombreComercial}
    ${this.tramiteSeleccionado.actividad?.nombre} /
    ${this.tramiteSeleccionado.clasificacion?.nombre}  /
    ${this.tramiteSeleccionado.categoria?.nombre}`;

        this.dialogoCausalesInactivacion = true;
    }

    mostrarDialogoDevolverTramite() {
        if (!this.tramiteSeleccionado?.id) {
            this.messageService.getErrorsCustom('Debe seleccionar un trámite', 'Por favor seleccione un trámite');
            return;
        }

        this.dialogoTitulo = `Devolver Trámite -
    ${this.tramiteSeleccionado.establecimiento?.nombreComercial}
    ${this.tramiteSeleccionado.actividad?.nombre} /
    ${this.tramiteSeleccionado.clasificacion?.nombre}  /
    ${this.tramiteSeleccionado.categoria?.nombre}`;
        this.motivoDevolucionTramite.reset();

        if (
            this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AGENDADA ||
            this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.CONFIRMADA ||
            this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_1 ||
            this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_2
        ) {
            this.messageService.getErrorsCustom('Ya no puede devolver el trámite', 'El trámite se encuentra gestionado por usted');
            return;
        }

        this.dialogoDevolverTramite = true;
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
        let fechaLimite = new Date(this.tramiteSeleccionado.inspeccionActual?.fechaLimite!);

        if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA) {
            fechaInspeccion = new Date(this.tramiteSeleccionado.inspeccionActual?.fechaSolicitud!);
            this.fechaMaximaAgenda = addDays(fechaInspeccion, 30);
        }

        fechaInspeccion.setHours(12);
        fechaInspeccion.setMinutes(0);
        fechaInspeccion.setSeconds(0);

        if (differenceInDays(new Date(), fechaInspeccion) >= 0) {
            this.fechaActual = new Date();
        } else {
            this.fechaActual = fechaInspeccion;
        }

        if (this.tramiteSeleccionado.inspeccionActual?.fechaLimite) this.fechaMaximaAgenda = new Date(this.tramiteSeleccionado.inspeccionActual?.fechaLimite!);

        // if (isAfter(fechaInspeccion, new Date('2024-07-25'))) {
        //   if (this.tramiteSeleccionado.inspeccionActual?.fechaLimite)
        //     this.fechaMaximaAgenda = addDays(new Date(this.tramiteSeleccionado.inspeccionActual?.fechaLimite!), 30);
        // } else {
        //   this.fechaMaximaAgenda = addDays(new Date(), 30);
        // }

        if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_2) {
            this.messageService.getErrorsCustom('Ya no puede volver a reagendar', 'Ya se ha reagendado en 2 ocasiones');
            return;
        }

        if (!this.tramiteSeleccionado.inspeccionActual?.fechaLimite) {
            this.messageService.getErrorsCustom('No puede agendar', 'No Existe una fecha límite para este trámite, comuníquese con la Dirección de Acredicación y Control');
            return;
        }

        if (isAfter(new Date(), fechaLimite)) {
            // this.messageService.getErrorsCustom('No puede agendar', 'La fecha limite fue el ' + format(fechaLimite, 'y-M-d'));
            this.messageService.getErrorsCustom('No puede agendar', 'Ha excedido la fecha límite');
            return;
        }

        if (this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_1) {
            if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
                // this.fechaMaximaAgenda = new Date('2100-12-31');
                // this.fechaMaximaAgenda = addDays(fechaInspeccion, 30);
                this.fechaMaximaAgenda = new Date(this.tramiteSeleccionado.inspeccionActual?.fechaLimite!);
                this.dialogoAgendarTramite = true;
                return;
            }

            if (
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION
            ) {
                if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA && this.obtenerDiferenciaFechas(this.tramiteSeleccionado.inspeccionActual.fechaInspeccion) <= 0) {
                    this.messageService.getErrorsCustom('No se cumple el tiempo determinado', 'Por favor espere a que se cumpla el tiempo determinado en la normativa vigente; o, que el usuario solicite la primera inspección');
                    return;
                }

                // if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.CONFIRMADA
                //   || this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_1
                // ) {
                //   this.fechaMaximaAgenda = addDays(fechaInspeccion, 30);// esto es temporal hasta que se igualen todos los tramites de ahi cambiar a 5
                // }
            }
        }

        if (this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2) {
            if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION) {
                // if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA) {
                //   this.messageService.getErrorsCustom('No se puede agendar', 'Mientras el usuario externo no solicite fecha de inspección');
                //   return;
                // }
                if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA && this.obtenerDiferenciaFechas(this.tramiteSeleccionado.inspeccionActual.fechaInspeccion) <= 0) {
                    this.messageService.getErrorsCustom('No se cumple el tiempo determinado', 'Por favor espere a que se cumpla el tiempo determinado en la normativa vigente; o, que el usuario solicite la segunda inspección');
                    return;
                }

                if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.CONFIRMADA || this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.RE_AGENDADA_1) {
                    this.fechaMaximaAgenda = addBusinessDays(new Date(this.tramiteSeleccionado.inspeccionActual.fechaInspeccion!), 30); // esto es temporal hasta que se igualen todos los tramites de ahi cambiar a 5
                    this.dialogoAgendarTramite = true;
                    return;
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

        let fechaLimite = new Date(this.tramiteSeleccionado.inspeccionActual?.fechaLimite!);
        let fechaLimiteInspeccion = new Date(this.tramiteSeleccionado.fechaLimiteInspeccion!);

        if (isAfter(new Date(), fechaLimiteInspeccion)) {
            // this.messageService.getErrorsCustom('No puede agendar', 'La fecha limite fue el ' + format(fechaLimite, 'y-M-d'));
            this.messageService.getErrorsCustom('No puede realizar esta acción', 'Ha excedido la fecha límite');
            return;
        }

        this.checkHrefFormatChecklist();
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

    checkHrefFormatChecklist() {
        if (this.tramiteSeleccionado.actividad?.codigo == 'alimentos_bebidas_continente') {
            this.hrefFormatChecklist = 'ayb_continente.xls';
        }

        if (this.tramiteSeleccionado.actividad?.codigo == 'alimentos_bebidas_galapagos') {
            this.hrefFormatChecklist = 'ayb_galapagos.xls';
        }

        if (this.tramiteSeleccionado.actividad?.codigo == 'alojamiento_continente') {
            this.hrefFormatChecklist = 'alojamiento_ continente.xlsx';
        }

        if (this.tramiteSeleccionado.actividad?.codigo == 'alojamiento_galapagos') {
            this.hrefFormatChecklist = 'alojamiento_galapagos.xls';
        }

        if (this.tramiteSeleccionado.actividad?.codigo == 'operacion_intermediacion_continente') {
            this.hrefFormatChecklist = 'operacion_intermediacion_continente.xls';
        }

        if (this.tramiteSeleccionado.actividad?.codigo == 'parques_continente' && this.tramiteSeleccionado.clasificacion?.codigo == 'balnearios') {
            this.hrefFormatChecklist = 'balnearios_continente.xlsx';
        }

        if (this.tramiteSeleccionado.actividad?.codigo == 'eventos_continente' && this.tramiteSeleccionado.clasificacion?.codigo == 'salas') {
            this.hrefFormatChecklist = 'sala_recepciones_banquetes_continente.xlsx';
        }

        if (this.tramiteSeleccionado.actividad?.codigo == 'parques_continente' && this.tramiteSeleccionado.clasificacion?.codigo == 'termas') {
            this.hrefFormatChecklist = 'termas_continente.xlsx';
        }
    }

    mostrarDialogoDescargas() {
        if (!this.tramiteSeleccionado?.id) {
            this.messageService.getErrorsCustom('Debe seleccionar un trámite', 'Por favor seleccione un trámite');
            return;
        }

        let fechaLimiteInspeccion = new Date(this.tramiteSeleccionado.fechaLimiteInspeccion!);

        if (isAfter(new Date(), fechaLimiteInspeccion)) {
            // this.messageService.getErrorsCustom('No puede agendar', 'La fecha limite fue el ' + format(fechaLimite, 'y-M-d'));
            this.messageService.getErrorsCustom('No puede realizar esta acción', 'Ha excedido la fecha límite');
            return;
        }

        if (this.tramiteSeleccionado?.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA || this.tramiteSeleccionado?.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.SOLICITADA) {
            this.messageService.getErrorsCustom('El trámite debe estar confirmado, agendado o reagendado', 'Por favor agende el trámite');
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

            if (
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_ACTIVIDAD
            ) {
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

    mostrarDialogoFormatosChecklist() {}

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

    obtenerCuasalesIncumplimientoInactivacion() {
        this.causalesInactivacionInterno = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.CAUSALES_INACTIVACION_INTERNO);
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

    cargarArchivoFormularioRequisitosInactivacion(event: any) {
        if (event.files.length) {
            this.formularioRequisitosInactivacionField.patchValue(event.files[0]);
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
            (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION ||
                this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_ACTIVIDAD)
        ) {
            this.catastroEstados = this.catastroEstadosClon.filter(
                (catastroEstado) =>
                    catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO ||
                    catastroEstado.codigo === CatastroEstadoEnum.INACTIVO ||
                    catastroEstado.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO ||
                    catastroEstado.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO ||
                    catastroEstado.codigo === CatastroEstadoEnum.SUSPENSION_TEMPORAL
            );
        }

        if (
            this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2 &&
            this.obtenerDiferenciaFechas(this.tramiteSeleccionado.inspeccionActual?.fechaInspeccion) <= 0 &&
            (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REGISTRO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.REINGRESO || this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION)
        ) {
            this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO || catastroEstado.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA);
        }

        if (this.tramiteSeleccionado.estado?.codigo === TramiteEstadosEnum.PENDIENTE_INSPECCION_2 && this.obtenerDiferenciaFechas(this.tramiteSeleccionado.inspeccionActual?.fechaInspeccion) > 0) {
            if (this.tramiteSeleccionado.inspeccionActual?.estadoFecha?.codigo === InspeccionEstadoFechaEnum.AUTO_GENERADA) {
                this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA);
            } else {
                this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO || catastroEstado.codigo === CatastroEstadoEnum.SUSPENSION_DEFINITIVA);
            }
        }

        if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
            this.catastroEstados = this.catastroEstadosClon.filter((catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO);
        }

        if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION) {
            this.catastroEstados = this.catastroEstadosClon.filter(
                (catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO || catastroEstado.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO || catastroEstado.codigo === CatastroEstadoEnum.INACTIVO
            );
        }

        if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION) {
            this.catastroEstados = this.catastroEstadosClon.filter(
                (catastroEstado) => catastroEstado.codigo === CatastroEstadoEnum.RATIFICADO || catastroEstado.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO || catastroEstado.codigo === CatastroEstadoEnum.INACTIVO
            );
        }
    }

    configurarCamposObligatoriosEstadoInspeccion() {
        this.catastroEstadoField.setValidators(Validators.required);
        this.clasificacionField.setValidators(null);
        this.categoriaField.setValidators(null);
        this.causalesIncumplimientoField.setValidators(null);
        this.formularioRequisitosField.setValidators(null);
        this.formularioRequisitosInactivacionField.setValidators(null);
        this.formularioRequisitosIncumplimientoField.setValidators(null);
        this.actaActualizacionField.setValidators(null);
        this.actaNotificacionTemporalField.setValidators(null);
        this.actaNotificacionDefinitivaField.setValidators(null);
        this.observacionesActualizacionField.setValidators(null);

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

        if (this.catastroEstadoField.value?.codigo == 'inactivo') {
            this.formularioRequisitosField.clearValidators();
            this.formularioRequisitosInactivacionField.setValidators(Validators.required);
            this.formularioRequisitosField.updateValueAndValidity();
            this.formularioRequisitosInactivacionField.updateValueAndValidity();
        }

        if (this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO || this.catastroEstadoField.value?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO) {
            this.formularioRequisitosIncumplimientoField.setValidators(Validators.required);
            this.formularioRequisitosIncumplimientoField.updateValueAndValidity();
        }

        if (this.tramiteSeleccionado.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
            this.actaActualizacionField.setValidators(Validators.required);
            this.observacionesActualizacionField.setValidators(Validators.required);
            this.actaActualizacionField.updateValueAndValidity();
            this.observacionesActualizacionField.updateValueAndValidity();
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
            const fecha = new Date(fechaInspeccion);
            fecha.setHours(0);
            fecha.setMinutes(0);
            fecha.setSeconds(0);
            const fechaActual = new Date();
            fechaActual.setHours(0);
            fechaActual.setMinutes(0);
            fechaActual.setSeconds(0);

            const diferencia = formatDistanceStrict(fecha, fechaActual, { unit: 'day', addSuffix: true });
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

    removerArchivoFormularioRequisitosInactivacion() {
        this.formularioRequisitosInactivacionField.setValue(null);
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
        this.tecnicoZonalHttpService.generarReporteTramitesPorUsuarioInternoXLSX(this.authService.usuarioInterno.id!);
    }

    paginar(event: any) {
        if (this.buscador.value) {
            if (this.indiceTab === 0) {
                this.obtenerTramitesNoAtendidosPorUsuarioInterno(event.page + 1, this.buscador.value);
            }
            if (this.indiceTab === 1) {
                this.obtenerTramitesAtendidosPorUsuarioInterno(event.page + 1, this.buscador.value);
            }
        } else {
            if (this.indiceTab === 0) {
                this.obtenerTramitesNoAtendidosPorUsuarioInterno(event.page + 1);
            }
            if (this.indiceTab === 1) {
                this.obtenerTramitesAtendidosPorUsuarioInterno(event.page + 1);
            }
        }
    }

    inactivarTramiteInactivacion(event: boolean) {
        this.dialogoCausalesInactivacion = event;
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

    get formularioRequisitosInactivacionField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['formularioRequisitosInactivacion'];
    }

    get causalesIncumplimientoField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['causalesIncumplimiento'];
    }

    get causalesInactivacionField(): AbstractControl {
        return this.formularioEstadoInspeccion.controls['causalesInactivacion'];
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

    get observacionesActualizacionField(): FormArray {
        return this.formularioEstadoInspeccion.controls['observacionesActualizacion'] as FormArray;
    }
}
