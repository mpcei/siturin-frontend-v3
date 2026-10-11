import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { LabelDirective } from '../../../../../../legacy/shared/directives/label.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ErrorMessageDirective } from '../../../../../../legacy/shared/directives/error-message.directive';
import { Divider } from 'primeng/divider';
import { Checkbox } from 'primeng/checkbox';
import { PrimeTemplate } from 'primeng/api';
import { Panel } from 'primeng/panel';
import { MultiSelect } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Dialog } from 'primeng/dialog';
import { ProgressBarComponent } from '../../../../../../legacy/shared/components/progress-bar/progress-bar.component';
import { InputText } from 'primeng/inputtext';
import { KeyFilter } from 'primeng/keyfilter';
import { Tag } from 'primeng/tag';
import { DatosSriComponent } from '../../../../compartido/datos-sri/datos-sri.component';

import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { Tabs } from 'primeng/tabs';
import { TabList } from 'primeng/tabs';
import { Tab } from 'primeng/tabs';
import { TabPanels } from 'primeng/tabs';
import { TabPanel } from 'primeng/tabs';
import { CatalogoModel, CompaniaTransporteTuristicoModel, EstablecimientoModel, GuiaTurismoModel, ModalidadTurismoAventuraModel, NormativaModel, TramiteModel } from '@/legacy/models/siturin';
import { ColumnModel } from '@/legacy/models/core';
import { ApiRestInternosHttpService, CatalogosSiturinService, CatastrosHttpService, CtcHttpService, DinardapHttpService, EstablecimientosHttpService, EstablecimientosService, NormativasHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { ActividadCtcCodigoEnum, CatalogoSiturinTipoEnum, TramiteTiposEnum } from '@/legacy/shared/enums';
@Component({
    selector: 'app-ctc-actualizacion',
    templateUrl: './ctc-actualizacion.component.html',
    styleUrls: ['./ctc-actualizacion.component.scss'],
    imports: [
        Bind,
        Card,
        ReactiveFormsModule,
        NgIf,
        LabelDirective,
        ToggleSwitch,
        ErrorMessageDirective,
        Divider,
        NgFor,
        Checkbox,
        PrimeTemplate,
        Panel,
        MultiSelect,
        TableModule,
        ButtonDirective,
        Ripple,
        Dialog,
        ProgressBarComponent,
        InputText,
        KeyFilter,
        Tag,
        DatosSriComponent,
        AsyncPipe,
        InputNumber,
        Select,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel
    ]
})
export class CtcActualizacionComponent implements OnInit {
    @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();
    @Input() actividad: AbstractControl = new FormControl();
    @Input() clasificacion: AbstractControl = new FormControl();
    @Input() categoria: AbstractControl = new FormControl();

    private catastrosHttpService=inject( CatastrosHttpService);
    private dinardapHttpService=inject( DinardapHttpService);
    private apiRestInternosHttpService=inject( ApiRestInternosHttpService);
    private ctcHttpService=inject( CtcHttpService);
    private catalogosSiturinService=inject( CatalogosSiturinService);
    private coreService=inject( CoreService);
    private establecimientosService=inject( EstablecimientosService);
    private establecimientosHttpService=inject( EstablecimientosHttpService);
    private normativasHttpService=inject( NormativasHttpService);
    private formBuilder=inject( FormBuilder);
    public messageService=inject( MessageService);
    private router=inject( Router);

    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
    formulario: FormGroup = this.nuevoFormulario;
    formularioAlojamiento: FormGroup = this.nuevoFormularioAlojamiento;
    formularioGuiaTurismo: FormGroup = this.nuevoFormularioGuiaTurismo;
    actividadesTuristicas: CatalogoModel[] = [];
    tieneAlojamiento: boolean = false;
    tieneAlimentosBebidas: boolean = false;
    tieneOperacion: boolean = false;
    tieneTransporte: boolean = false;
    indiceActividades: number = -1;
    modalidadesTurismoAventuraAgua: CatalogoModel[] = [];
    modalidadesTurismoAventuraAire: CatalogoModel[] = [];
    modalidadesTurismoAventuraTierra: CatalogoModel[] = [];
    normativaRespuestasModalidadesTurismoAventura: any[] = [];
    columnasGuiasTurismoTabla: ColumnModel[] = this.configurarColumnasGuiasTurismoTabla();
    cargado$ = this.coreService.loaded$;
    dialogoNuevoGuiasTurismo: boolean = false;
    indexGuiasTurismo: number = -1;
    normativaGeneralRespuestas: NormativaModel[] = [];
    normativaAlojamientoRespuestas: NormativaModel[] = [];
    normativaAlimentosBebidasRespuestas: NormativaModel[] = [];
    normativaOperacionRespuestas: NormativaModel[] = [];
    alojamientoId: number = 0;
    alimentosBebidasId: number = 0;
    operacionId: number = 0;
    transporteId: number = 0;
    errores: string[] = [];
    dialogoCrearTramite: boolean = false;
    dialogoNuevoCompaniasTransporteTuristico: boolean = false;
    formularioCompaniaTransporteTuristico: FormGroup = this.nuevoFormularioCompaniaTransporteTuristico;
    indexCompaniasTransporteTuristico: number = -1;
    columnasCompaniasTransporteTuristicoTabla: ColumnModel[] = this.configurarColumnasCompaniasTransporteTuristicoTabla();
    transporteTipos: CatalogoModel[] = [];
    numeroAutorizacionLabel: string = '';

    constructor() {
        this.formulario.valueChanges.subscribe((_) => {
            this.validarFormulario();
        });

        this.actividadesTuristicasField.valueChanges.subscribe((value) => {
            this.tieneAlojamiento = !!value.find((value: CatalogoModel) => value.codigo === 'alojamiento');

            this.tieneAlimentosBebidas = !!value.find((value: CatalogoModel) => value.codigo === 'alimentos_bebidas');

            this.tieneOperacion = !!value.find((value: CatalogoModel) => value.codigo === 'operacion');

            this.tieneTransporte = !!value.find((value: CatalogoModel) => value.codigo === 'transporte');

            if (!this.tieneAlojamiento && !this.tieneAlimentosBebidas && !this.tieneOperacion && !this.tieneTransporte) {
                this.indiceActividades = -1;
            }

            this.seleccionarActividadTuristica();
        });

        this.cedulaGuiaTurismoField.valueChanges.subscribe((value) => {
            this.esGuiaTurismoField.setValue(null);
            if (value && value.length === 10) {
                this.apiRestInternosHttpService.obtenerGuia(value).subscribe((guia) => {
                    if (guia?.apellidosNombres) {
                        this.nombresGuiaTurismoField.setValue(guia.apellidosNombres);
                        this.licenciasGuiaTurismoField.setValue(guia.licencias);
                        this.esGuiaTurismoField.setValue(true);
                    } else {
                        this.esGuiaTurismoField.setValue(false);
                    }
                });
            } else {
                this.nombresGuiaTurismoField.setValue(null);
                this.esGuiaTurismoField.setValue(false);
            }

            this.formularioGuiaTurismo.updateValueAndValidity();
        });

        this.tipoField.valueChanges.subscribe((value) => {
            switch (value?.codigo) {
                case 'aereo':
                    this.numeroAutorizacionLabel = 'Número de autorización emitido en el certificado de Operador Aéreo otorgado por la Dirección General de Aviación Civil (DAC):';
                    break;
                case 'maritimo':
                    this.numeroAutorizacionLabel = `Número de autorización emitido en la matrícula de Armador otorgada por el Ministerio de Transporte y Obras Públicas (MTOP):`;
                    break;
                case 'terrestre':
                    this.numeroAutorizacionLabel = 'Número de autorización emitido en el Permiso de Operación otorgado por la Agencia Nacional de Transito (ANT):';
                    break;
            }
        });
    }

    ngOnInit(): void {
        this.obtenerModalidadesTurismoAventura();
        this.obtenerTiposTransporte();
        this.precargarDatos();
        this.obtenerActividadesTuristicas();
    }

    precargarDatos() {
        if (this.establecimientoSeleccionado.tramiteActual) {
            this.formulario.patchValue(this.establecimientoSeleccionado?.tramiteActual?.tramiteCtc!);
            this.tieneCertificadoRegistroPropiedadField.disable();
            this.tieneInformeTecnicoField.disable();
            this.tieneEstatutoField.disable();
            this.actividadesTuristicasField.patchValue(this.establecimientoSeleccionado.tramiteActual?.ctcActividades!);
            this.alojamientoField.patchValue(this.establecimientoSeleccionado?.tramiteActual?.tramiteCtc!);
            this.alimentosBebidasField.patchValue(this.establecimientoSeleccionado.tramiteActual?.tramiteCtc!);
            this.establecimientoSeleccionado.tramiteActual?.ctcActividades?.forEach((actividad) => {
                if (actividad.actividad?.codigo === 'alimentos_bebidas') {
                    this.tieneAlimentosBebidas = true;
                }
                if (actividad.actividad?.codigo === 'alojamiento') {
                    this.tieneAlojamiento = true;
                }
                if (actividad.actividad?.codigo === 'operacion') {
                    this.tieneOperacion = true;
                }
                if (actividad.actividad?.codigo === 'transporte') {
                    this.tieneTransporte = true;
                }
            });

            if (this.establecimientoSeleccionado.tramiteActual?.modalidadesTurismoAventura && this.establecimientoSeleccionado.tramiteActual?.modalidadesTurismoAventura?.length > 0) {
                this.tieneModalidadesTurismoAventuraField.setValue(true);
                this.modalidadesTurismoAventuraAguaField.patchValue(
                    this.establecimientoSeleccionado.tramiteActual?.modalidadesTurismoAventura.filter((modalidad: ModalidadTurismoAventuraModel) => modalidad.tipo?.padre?.codigo === 'agua').map((modalidad) => modalidad.tipo)
                );
                this.modalidadesTurismoAventuraAireField.patchValue(
                    this.establecimientoSeleccionado.tramiteActual?.modalidadesTurismoAventura.filter((modalidad: ModalidadTurismoAventuraModel) => modalidad.tipo?.padre?.codigo === 'aire').map((modalidad) => modalidad.tipo)
                );
                this.modalidadesTurismoAventuraTierraField.patchValue(
                    this.establecimientoSeleccionado.tramiteActual?.modalidadesTurismoAventura.filter((modalidad: ModalidadTurismoAventuraModel) => modalidad.tipo?.padre?.codigo === 'tierra').map((modalidad) => modalidad.tipo)
                );
            }

            if (this.establecimientoSeleccionado.tramiteActual?.guiasTurismo && this.establecimientoSeleccionado.tramiteActual?.guiasTurismo?.length > 0) {
                this.tieneGuiasTurismoField.setValue(true);
                this.guiasTurismoField.patchValue(this.establecimientoSeleccionado.tramiteActual?.guiasTurismo);
            }

            if (this.establecimientoSeleccionado.tramiteActual?.companiasTransporteTuristico && this.establecimientoSeleccionado.tramiteActual?.companiasTransporteTuristico?.length > 0) {
                this.tieneCompaniasTransporteTuristicoField.setValue(true);
                this.companiasTransporteTuristicoField.patchValue(this.establecimientoSeleccionado.tramiteActual?.companiasTransporteTuristico);
            }
        }
    }

    obtenerTiposTransporte() {
        this.transporteTipos = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TRANSPORTE_TIPOS);
    }

    obtenerActividadesTuristicas() {
        const actividadesTuristicas = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.ACTIVIDADES_TURISTICAS);
        actividadesTuristicas.forEach((actividadTuristica: CatalogoModel) => {
            this.establecimientoSeleccionado?.tramiteActual?.ctcActividades?.forEach((ctcActividad) => {
                if (ctcActividad.actividad?.codigo === actividadTuristica.codigo) {
                    this.actividadesTuristicas.push(actividadTuristica);
                }
            });
        });

        this.actividadesTuristicasField.setValue(this.actividadesTuristicas);
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

    get nuevoFormulario(): FormGroup {
        return this.formBuilder.group({
            tramiteActual: [this.establecimientoSeleccionado.tramiteActual],
            provincia: [this.establecimientoSeleccionado.provincia],
            ruc: [this.establecimientoSeleccionado.ruc],
            tieneCertificadoRegistroPropiedad: [false, [Validators.requiredTrue]],
            tieneInformeTecnico: [false, [Validators.requiredTrue]],
            tieneEstatuto: [false, [Validators.requiredTrue]],
            actividadesTuristicas: [[], Validators.required],
            normativaRespuestas: [[]],
            actividadAlimentosBebidas: this.nuevoFormularioAlimentosBebidas,
            actividadAlojamiento: this.nuevoFormularioAlojamiento,
            actividadOperacion: this.nuevoFormularioOperacionTuristicaComunitaria,
            actividadTransporte: this.nuevoFormularioTransporte
        });
    }

    get nuevoFormularioCompaniaTransporteTuristico() {
        return this.formBuilder.group({
            ruc: [null],
            razonSocial: [null],
            tipoContribuyente: [null],
            numeroAutorizacion: [null],
            cedulaRepresentanteLegal: [null],
            nombreRepresentanteLegal: [null],
            tipo: [null]
        });
    }

    get nuevoFormularioAlojamiento(): FormGroup {
        return this.formBuilder.group({
            id: [null],
            totalHabitaciones: [0],
            totalCamas: [0],
            totalPlazas: [0],
            normativaRespuestas: [[]]
        });
    }

    get nuevoFormularioAlimentosBebidas(): FormGroup {
        return this.formBuilder.group({
            id: [null],
            totalMesas: [0],
            totalCapacidades: [0],
            normativaRespuestas: [[]]
        });
    }

    get nuevoFormularioOperacionTuristicaComunitaria(): FormGroup {
        return this.formBuilder.group({
            tieneGuiasTurismo: [false],
            tieneModalidadesTurismoAventura: [false],
            guiasTurismo: [[]],
            modalidadesTurismoAventuraAgua: [[]],
            modalidadesTurismoAventuraAire: [[]],
            modalidadesTurismoAventuraTierra: [[]],
            normativaRespuestas: [[]]
        });
    }

    get nuevoFormularioTransporte(): FormGroup {
        return this.formBuilder.group({
            companiasTransporteTuristico: [[]],
            tieneCompaniasTransporteTuristico: [false]
        });
    }

    get nuevoFormularioGuiaTurismo() {
        return this.formBuilder.group({
            cedula: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            nombres: [null, [Validators.required]],
            esGuia: [null],
            licencias: [[]],
            nacionalidad: [null]
        });
    }

    onSubmit() {
        if (this.validarFormulario()) {
            this.guardarTramite();
        } else {
            this.formulario.markAllAsTouched();
            this.messageService.errorsFields.then();
        }
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
                    this.ctcHttpService.guardarTramiteContinente(this.formulario.value).subscribe(
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

    validarFormulario() {
        this.errores = [];
        // if (this.tieneOperacion && this.tieneModalidadesTurismoAventuraField.value && this.normativaOperacionRespuestas.length === 0) {
        //   this.errores.push('La Normativa de Modalidades de Turismo Aventura tiene errores');
        // }

        if (this.tieneOperacion && this.tieneGuiasTurismoField.value && this.guiasTurismoField.value.length === 0) {
            this.errores.push('Debe declarar por lo menos un Guía de Turismo');
        }

        if (this.tieneOperacion && !this.tieneModalidadesTurismoAventuraField.value && !this.tieneGuiasTurismoField.value) {
            this.errores.push('Debe seleccionar por lo menos una Modalidad de Turismo Aventura y/o un Guía de Turismo');
        }

        if (
            this.tieneOperacion &&
            this.tieneModalidadesTurismoAventuraField.value &&
            this.modalidadesTurismoAventuraAguaField.value?.length == 0 &&
            this.modalidadesTurismoAventuraAireField.value?.length == 0 &&
            this.modalidadesTurismoAventuraTierraField.value?.length == 0
        ) {
            this.errores.push('Debe seleccionar al menos una (1) Modalidad de Turismo Aventura');
        }

        if (this.tieneTransporte && !this.companiasTransporteTuristicoField.valid) {
            this.errores.push('Debe agregar un transporte como mínimo');
        }

        if (!this.actividadesTuristicasField.valid) {
            this.errores.push('Debe seleccionar por lo menos una actividad turística');
        }

        return this.errores.length === 0 && this.formulario.valid;
    }

    seleccionarActividadTuristica() {
        let actividad = null;
        if (this.tieneAlimentosBebidas) {
            this.indiceActividades = 0;
            actividad = this.actividadesTuristicasField.value.find((actividad: CatalogoModel) => actividad.codigo === ActividadCtcCodigoEnum.ALIMENTOS_BEBIDAS_ACTIVIDADES_TURISTICAS);
            if (actividad) {
                this.alimentosBebidasId = actividad.id;
            }

            this.totalCapacidadesField.setValidators(Validators.required);
            this.totalMesasField.setValidators(Validators.required);
        } else {
            this.totalCapacidadesField.setValidators(null);
            this.totalMesasField.setValidators(null);
        }

        if (this.tieneAlojamiento) {
            this.indiceActividades = 1;
            actividad = this.actividadesTuristicasField.value.find((actividad: CatalogoModel) => actividad.codigo === ActividadCtcCodigoEnum.ALOJAMIENTO_ACTIVIDADES_TURISTICAS);

            if (actividad) {
                this.alojamientoId = actividad.id;
            }

            this.totalCamasField.setValidators(Validators.required);
            this.totalPlazasField.setValidators(Validators.required);
            this.totalHabitacionesField.setValidators(Validators.required);
        } else {
            this.totalCamasField.setValidators(null);
            this.totalPlazasField.setValidators(null);
            this.totalHabitacionesField.setValidators(null);
        }

        if (this.tieneOperacion) {
            this.indiceActividades = 2;
            actividad = this.actividadesTuristicasField.value.find((actividad: CatalogoModel) => actividad.codigo === ActividadCtcCodigoEnum.OPERACION_ACTIVIDADES_TURISTICAS);

            if (actividad) {
                this.operacionId = actividad.id;
            }

            if (this.tieneGuiasTurismoField.value) {
                this.guiasTurismoField.setValidators(Validators.required);
            }
        } else {
            if (!this.tieneModalidadesTurismoAventuraField.value) {
                this.modalidadesTurismoAventuraAireField.setValidators(null);
                this.modalidadesTurismoAventuraAguaField.setValidators(null);
                this.modalidadesTurismoAventuraTierraField.setValidators(null);
            }

            if (!this.tieneGuiasTurismoField.value) {
                this.guiasTurismoField.setValidators(null);
            }
        }

        if (this.tieneTransporte) {
            this.indiceActividades = 3;
            actividad = this.actividadesTuristicasField.value.find((actividad: CatalogoModel) => actividad.codigo === ActividadCtcCodigoEnum.TRANSPORTE_ACTIVIDADES_TURISTICAS);

            if (actividad) {
                this.transporteId = actividad.id;
            }

            this.companiasTransporteTuristicoField.setValidators(Validators.required);
            this.tieneCompaniasTransporteTuristicoField.setValidators(Validators.required);
        } else {
            this.companiasTransporteTuristicoField.setValidators(null);
            this.tieneCompaniasTransporteTuristicoField.setValidators(null);
        }
    }

    llenarNormativaRespuestasAlimentosBebidas(normativaRespuestas: any[]) {
        this.normativaAlimentosBebidasRespuestas = normativaRespuestas;
        this.normativaAlimentosBebidasRespuestasField.setValue(normativaRespuestas);
        this.validarFormulario();
    }

    llenarNormativaRespuestasAlojamiento(normativaRespuestas: any[]) {
        this.normativaAlojamientoRespuestas = normativaRespuestas;
        this.normativaAlojamientoRespuestasField.setValue(normativaRespuestas);
        this.validarFormulario();
    }

    llenarNormativaRespuestasOperacion(normativaRespuestas: any[]) {
        this.normativaOperacionRespuestas = normativaRespuestas;
        this.normativaRespuestasModalidadesTurismoAventuraField.setValue(normativaRespuestas);
        this.validarFormulario();
    }

    configurarColumnasGuiasTurismoTabla(): ColumnModel[] {
        return [
            { field: 'cedula', header: 'Identificación' },
            { field: 'nombres', header: 'Nombres Completos' }
            // {field: 'esGuia', header: 'Es Guía'},
        ];
    }

    mostrarDialogoNuevoGuiasTurismo() {
        this.dialogoNuevoGuiasTurismo = true;
        this.indexGuiasTurismo = -1;
        this.formularioGuiaTurismo.reset();
    }

    agregarGuiaTurismo() {
        if (this.formularioGuiaTurismo.valid) {
            const guias: any[] = this.guiasTurismoField.value;

            if (guias.find((guia) => guia.cedula === this.cedulaGuiaTurismoField.value)) {
                this.dialogoNuevoGuiasTurismo = false;
                this.messageService.getInfoCustom('El guía ya existe', 'Los datos han sido actualizados');
                return;
            }

            if (this.indexGuiasTurismo > -1) {
                this.guiasTurismoField.value[this.indexGuiasTurismo] = this.formularioGuiaTurismo.value;
            } else {
                this.guiasTurismoField.value.push(this.formularioGuiaTurismo.value);
            }

            if (this.establecimientoSeleccionado.tramiteActual) {
                this.establecimientoSeleccionado.tramiteActual.guiasTurismo = this.guiasTurismoField.value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }

            this.guiasTurismoField.updateValueAndValidity();
            this.dialogoNuevoGuiasTurismo = false;
        } else {
            this.formularioGuiaTurismo.markAllAsTouched();
        }
    }

    agregarCompaniaTransporteTuristico() {
        if (this.formularioCompaniaTransporteTuristico.valid) {
            const companias: any[] = this.companiasTransporteTuristicoField.value;

            // if (companias.find(compania => compania.ruc === this.numeroRucCompaniaTransporteTuristicoField.value)) {
            //   this.dialogoNuevoCompaniasTransporteTuristico = false;
            //   this.messageService.getInfoCustom('La compañía ya existe', 'Los datos han sido actualizados');
            //   return;
            // }

            if (this.indexCompaniasTransporteTuristico > -1) {
                this.companiasTransporteTuristicoField.value[this.indexCompaniasTransporteTuristico] = this.formularioCompaniaTransporteTuristico.value;
                this.messageService.getInfoCustom('La compañía ya existe', 'Los datos han sido actualizados');
            } else {
                this.companiasTransporteTuristicoField.value.push(this.formularioCompaniaTransporteTuristico.value);
            }

            if (this.establecimientoSeleccionado.tramiteActual) {
                this.establecimientoSeleccionado.tramiteActual.companiasTransporteTuristico = this.companiasTransporteTuristicoField.value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }

            this.companiasTransporteTuristicoField.updateValueAndValidity();
            this.dialogoNuevoCompaniasTransporteTuristico = false;
        } else {
            this.formularioCompaniaTransporteTuristico.markAllAsTouched();
        }
    }

    llenarCompaniaTransporteTuristico(companiaTransporteTuristico: CompaniaTransporteTuristicoModel) {
        this.razonSocialCompaniaTransporteTuristicoField.setValue(companiaTransporteTuristico.razonSocial);
        this.tipoContribuyenteCompaniaTransporteTuristicoField.setValue(companiaTransporteTuristico.tipoContribuyente);
        this.cedulaRepresentanteLegalField.setValue(companiaTransporteTuristico.cedulaRepresentanteLegal);
        this.nombreRepresentanteLegalField.setValue(companiaTransporteTuristico.nombreRepresentanteLegal);
    }

    editarGuiaTurismo(guiaTurismo: GuiaTurismoModel, index: number) {
        this.dialogoNuevoGuiasTurismo = true;
        this.indexGuiasTurismo = index;
        this.formularioGuiaTurismo.patchValue(guiaTurismo);
    }

    eliminarGuiaTurismo(index: number) {
        this.guiasTurismoField.value.splice(index, 1);

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.guiasTurismo = this.guiasTurismoField.value;
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
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

    configurarColumnasCompaniasTransporteTuristicoTabla(): ColumnModel[] {
        return [
            { field: 'ruc', header: 'RUC' },
            { field: 'razonSocial', header: 'Razón Social' },
            { field: 'tipo', header: 'Clasificación' }
        ];
    }

    mostrarDialogoNuevoCompaniasTransporteTuristico() {
        this.dialogoNuevoCompaniasTransporteTuristico = true;
        this.numeroRucCompaniaTransporteTuristicoField.reset();
        this.indexCompaniasTransporteTuristico = -1;
        this.formularioCompaniaTransporteTuristico.reset();
    }

    editarCompaniaTransporteTuristico(companiaTransporteTuristico: CompaniaTransporteTuristicoModel, index: number) {
        this.dialogoNuevoCompaniasTransporteTuristico = true;
        this.indexCompaniasTransporteTuristico = index;
        this.formularioCompaniaTransporteTuristico.patchValue(companiaTransporteTuristico);
        this.numeroRucCompaniaTransporteTuristicoField.patchValue(companiaTransporteTuristico.ruc);
    }

    eliminarCompaniaTransporteTuristico(index: number) {
        this.companiasTransporteTuristicoField.value.splice(index, 1);

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.companiasTransporteTuristico = this.companiasTransporteTuristicoField.value;
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }
    }

    get tieneCertificadoRegistroPropiedadField(): AbstractControl {
        return this.formulario.controls['tieneCertificadoRegistroPropiedad'];
    }

    get tieneInformeTecnicoField(): AbstractControl {
        return this.formulario.controls['tieneInformeTecnico'];
    }

    get tieneEstatutoField(): AbstractControl {
        return this.formulario.controls['tieneEstatuto'];
    }

    get normativaGeneralRespuestasField() {
        return this.formulario.controls['normativaRespuestas'];
    }

    get actividadesTuristicasField(): FormControl {
        return this.formulario.controls['actividadesTuristicas'] as FormControl;
    }

    get alojamientoField(): FormGroup {
        return this.formulario.controls['actividadAlojamiento'] as FormGroup;
    }

    get totalCamasField() {
        return this.alojamientoField.controls['totalCamas'];
    }

    get totalHabitacionesField() {
        return this.alojamientoField.controls['totalHabitaciones'];
    }

    get totalPlazasField() {
        return this.alojamientoField.controls['totalPlazas'];
    }

    get normativaAlojamientoRespuestasField() {
        return this.alojamientoField.controls['normativaRespuestas'];
    }

    get alimentosBebidasField(): FormGroup {
        return this.formulario.controls['actividadAlimentosBebidas'] as FormGroup;
    }

    get totalCapacidadesField() {
        return this.alimentosBebidasField.controls['totalCapacidades'];
    }

    get totalMesasField() {
        return this.alimentosBebidasField.controls['totalMesas'];
    }

    get normativaAlimentosBebidasRespuestasField() {
        return this.alimentosBebidasField.controls['normativaRespuestas'];
    }

    get operacionField(): FormGroup {
        return this.formulario.controls['actividadOperacion'] as FormGroup;
    }

    get tieneModalidadesTurismoAventuraField() {
        return this.operacionField.controls['tieneModalidadesTurismoAventura'];
    }

    get modalidadesTurismoAventuraAguaField() {
        return this.operacionField.controls['modalidadesTurismoAventuraAgua'];
    }

    get modalidadesTurismoAventuraAireField() {
        return this.operacionField.controls['modalidadesTurismoAventuraAire'];
    }

    get modalidadesTurismoAventuraTierraField() {
        return this.operacionField.controls['modalidadesTurismoAventuraTierra'];
    }

    get normativaRespuestasModalidadesTurismoAventuraField() {
        return this.operacionField.controls['normativaRespuestas'];
    }

    get tieneGuiasTurismoField() {
        return this.operacionField.controls['tieneGuiasTurismo'];
    }

    get guiasTurismoField() {
        return this.operacionField.controls['guiasTurismo'];
    }

    get cedulaGuiaTurismoField() {
        return this.formularioGuiaTurismo.controls['cedula'];
    }

    get nombresGuiaTurismoField() {
        return this.formularioGuiaTurismo.controls['nombres'];
    }

    get esGuiaTurismoField() {
        return this.formularioGuiaTurismo.controls['esGuia'];
    }

    get licenciasGuiaTurismoField() {
        return this.formularioGuiaTurismo.controls['licencias'];
    }

    get numeroCredencialGuiaTurismoField() {
        return this.formularioGuiaTurismo.controls['numeroCrendecial'];
    }

    get fechaExpiracionGuiaTurismoField() {
        return this.formularioGuiaTurismo.controls['fechaExpiracion'];
    }

    get transporteField(): FormGroup {
        return this.formulario.controls['actividadTransporte'] as FormGroup;
    }

    get companiasTransporteTuristicoField() {
        return this.transporteField.controls['companiasTransporteTuristico'];
    }

    get numeroRucCompaniaTransporteTuristicoField() {
        return this.formularioCompaniaTransporteTuristico.controls['ruc'];
    }

    get razonSocialCompaniaTransporteTuristicoField() {
        return this.formularioCompaniaTransporteTuristico.controls['razonSocial'];
    }

    get tipoContribuyenteCompaniaTransporteTuristicoField() {
        return this.formularioCompaniaTransporteTuristico.controls['tipoContribuyente'];
    }

    get cedulaRepresentanteLegalField() {
        return this.formularioCompaniaTransporteTuristico.controls['cedulaRepresentanteLegal'];
    }

    get nombreRepresentanteLegalField() {
        return this.formularioCompaniaTransporteTuristico.controls['nombreRepresentanteLegal'];
    }

    get numeroAutorizacionField() {
        return this.formularioCompaniaTransporteTuristico.controls['numeroAutorizacion'];
    }

    get tipoField() {
        return this.formularioCompaniaTransporteTuristico.controls['tipo'];
    }

    get tieneCompaniasTransporteTuristicoField() {
        return this.transporteField.controls['tieneCompaniasTransporteTuristico'];
    }

    protected readonly environment = environment;
}
