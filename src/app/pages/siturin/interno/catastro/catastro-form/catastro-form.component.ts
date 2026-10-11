import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CatalogoModel, CatastroEstadoModel, CatastroModel, DpaModel, ModalidadTurismoAventuraModel } from '@models/siturin';
import { AbstractControl, FormBuilder, FormGroup, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CatalogosSiturinService, CatastroEstadosHttpService, CatastrosHttpService, DpaService } from '@services/siturin';
import { ActividadCodigoEnum, CatalogoSiturinTipoEnum, CatastroEstadoEnum, RolesEnum, TramiteTiposLocalesEnum } from '@shared/enums';
import { CustomValidators } from '@shared/validators/custom-validators';
import { CoreService, MessageService } from '@services/core';
import { AuthService } from '@services/auth';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { DatosSriComponent } from '../../../compartido/datos-sri/datos-sri.component';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { Textarea } from 'primeng/textarea';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { FileUpload } from 'primeng/fileupload';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { MultiSelect } from 'primeng/multiselect';
import { AlojamientoComponent } from '../actividades/alojamiento/alojamiento.component';
import { AlimentosBebidasComponent } from '../actividades/alimentos-bebidas/alimentos-bebidas.component';
import { OperacionIntermediacionComponent } from '../actividades/operacion-intermediacion/operacion-intermediacion.component';
import { Dialog } from 'primeng/dialog';
import { InactivacionInternoComponent } from '../inactivacion-interno/inactivacion-interno.component';

import { InputNumber } from 'primeng/inputnumber';
@Component({
    selector: 'app-catastro-form',
    templateUrl: './catastro-form.component.html',
    styleUrls: ['./catastro-form.component.scss'],
    imports: [
        NgIf,
        DatosSriComponent,
        ReactiveFormsModule,
        Bind,
        Card,
        LabelDirective,
        Textarea,
        ErrorMessageDirective,
        FileUpload,
        InputText,
        DatePicker,
        Select,
        Tag,
        ButtonDirective,
        Ripple,
        MultiSelect,
        AlojamientoComponent,
        AlimentosBebidasComponent,
        OperacionIntermediacionComponent,
        NgFor,
        Dialog,
        InactivacionInternoComponent,
        AsyncPipe,
        InputNumber
    ]
})
export class CatastroFormComponent implements OnInit {
    @Input() catastroSeleccionado: CatastroModel = {};
    @Output() esVisibleCatastroOut: EventEmitter<boolean> = new EventEmitter<boolean>(true);
    public authService = inject(AuthService);
    private formBuilder = inject(FormBuilder);
    private coreService = inject(CoreService);
    private dpaService = inject(DpaService);
    private catalogosSiturinService = inject(CatalogosSiturinService);
    private catastroEstadosHttpService = inject(CatastroEstadosHttpService);
    private catastrosHttpService = inject(CatastrosHttpService);
    private messageService = inject(MessageService);
    private router = inject(Router);
    cargado$ = this.coreService.loaded$;
    cargando: boolean = false;
    formulario: FormGroup = this.nuevoFormulario;
    establecimientoEstados: CatalogoModel[] = [];
    estados: CatastroEstadoModel[] = [];
    dpa: DpaModel[] = [];
    provincias: DpaModel[] = [];
    cantones: DpaModel[] = [];
    parroquias: DpaModel[] = [];
    tipoLocales: CatalogoModel[] = [];
    modalidadesTurismoAventura: ModalidadTurismoAventuraModel[] = [];
    modalidadesTurismoAventuraAgua: CatalogoModel[] = [];
    modalidadesTurismoAventuraAire: CatalogoModel[] = [];
    modalidadesTurismoAventuraTierra: CatalogoModel[] = [];
    dialogoCausalesInactivacion: boolean = false;
    esEditable: boolean = false;
    camposInvalidos: string[] = [];

    constructor() {}

    ngOnInit(): void {
        this.habilitarCamposEditables();

        this.formulario.patchValue(this.catastroSeleccionado);
        if (!this.rucField.value?.pago) {
            this.rucField.patchValue({
                ...this.rucField.value,
                pago: {
                    ruc: this.rucField.value.numero,
                    tieneDeuda: false
                }
            });
        }
        this.obtenerEstablecimientoEstados();
        this.obtenerEstados();
        this.obtenerDpa();
        this.obtenerModalidadesTurismoAventura();
        this.obtenerTipoLocales();

        if (this.provinciaField.valid) {
            this.configurarDpaCantones(this.provinciaField.value);
        }

        if (this.cantonField.valid) {
            this.configurarDpaParroquias(this.cantonField.value);
        }

        // this.correoPropietarioField.patchValue(this.authService.auth.email);
        // this.correoPropietarioField.patchValue(this.personaContactoCorreoField.value);

        this.modalidadesTurismoAventuraAguaField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventura = [];
            if (this.modalidadesTurismoAventuraAguaField.value) {
                this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(this.modalidadesTurismoAventuraAireField.value, this.modalidadesTurismoAventuraTierraField.value);
            }

            this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);
        });

        this.modalidadesTurismoAventuraAireField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventura = [];
            if (this.modalidadesTurismoAventuraAireField.value) {
                this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(this.modalidadesTurismoAventuraAireField.value, this.modalidadesTurismoAventuraTierraField.value);
            }

            this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);
        });

        this.modalidadesTurismoAventuraTierraField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventura = [];
            if (this.modalidadesTurismoAventuraTierraField.value) {
                this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(this.modalidadesTurismoAventuraAireField.value, this.modalidadesTurismoAventuraTierraField.value);
            }

            this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);
        });

        this.establecimientoNumeroField.valueChanges.subscribe((value) => {
            const numeroRegistro = this.numeroRegistroField.value?.split('.');
            const secuencial = numeroRegistro[2];
            const pad = '000';
            const numeroEstablecimiento = pad.substring(0, pad.length - value?.length) + value;
            this.numeroRegistroField.setValue(`${numeroRegistro[0]}.${numeroEstablecimiento}.${secuencial}`);
        });
    }

    onSubmint() {}

    obtenerEstablecimientoEstados() {
        this.establecimientoEstados = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.ESTABLECIMIENTO_ESTADOS);
    }

    obtenerEstados() {
        this.catastroEstadosHttpService.obtenerCatastroEstados().subscribe((estados) => {
            if (this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO) {
                this.estados = estados.filter((estado) => {
                    return estado.codigo === CatastroEstadoEnum.INACTIVO || estado.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO;
                });
            }

            if (this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO) {
                this.estados = estados.filter((estado) => {
                    return estado.codigo === CatastroEstadoEnum.INACTIVO || estado.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO;
                });
            }

            if (this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION) {
                this.estados = estados.filter((estado) => {
                    return estado.codigo === CatastroEstadoEnum.INACTIVO || estado.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION;
                });
            }

            if (this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.RATIFICADO) {
                this.estados = estados.filter((estado) => {
                    return estado.codigo === CatastroEstadoEnum.INACTIVO || estado.codigo === CatastroEstadoEnum.RATIFICADO;
                });
            }
        });
    }

    obtenerDpa() {
        this.dpa = this.dpaService.dpa;
        this.configurarDpaProvincias();
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

        const agua: CatalogoModel[] = [];
        const aire: CatalogoModel[] = [];
        const tierra: CatalogoModel[] = [];
        this.modalidadesTurismoAventuraField.value.forEach((modalidad: ModalidadTurismoAventuraModel) => {
            if (modalidad?.tipo?.padre?.codigo === 'agua') {
                agua.push(modalidad.tipo);
            }
            if (modalidad?.tipo?.padre?.codigo === 'aire') {
                aire.push(modalidad.tipo);
            }
            if (modalidad?.tipo?.padre?.codigo === 'tierra') {
                tierra.push(modalidad.tipo);
            }
        });

        this.modalidadesTurismoAventuraAguaField.patchValue(agua);
        this.modalidadesTurismoAventuraAireField.patchValue(aire);
        this.modalidadesTurismoAventuraTierraField.patchValue(tierra);
    }

    obtenerTipoLocales() {
        this.tipoLocales = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TRAMITE_TIPOS_LOCALES);

        if (!(this.actividadField.value?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_CONTINENTE || this.actividadField.value?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_GALAPAGOS)) {
            this.tipoLocales = this.tipoLocales.filter((tipoLocal) => tipoLocal.codigo != TramiteTiposLocalesEnum.ESPACIO_COMPARTIDO);
        }
    }

    habilitarCamposEditables() {
        if (
            this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.RATIFICADO ||
            this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.RECLASIFICADO_OFICIO ||
            this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.RECATEGORIZADO_OFICIO ||
            this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION
        ) {
            this.esEditable = true;

            switch (this.authService.role.name) {
                case RolesEnum.DAC:
                    this.establecimientoNumeroField.enable();
                    this.fechaRegistroField.enable();
                    this.estadoField.enable();
                    this.calleReferenciaField.enable();
                    this.personaContactoTelefonoPrincipalField.enable();
                    this.personaContactoTelefonoSecundarioField.enable();
                    this.personaContactoCorreoField.enable();
                    this.establecimientopaginaWebField.enable();
                    this.totalHombresField.enable();
                    this.totalMujeresField.enable();
                    this.totalHombresDiscapacidadField.enable();
                    this.totalMujeresDiscapacidadField.enable();
                    this.tipoLocalField.enable();

                    this.callePrincipalField.enable();
                    this.calleIntereseccionField.enable();
                    this.calleNumeracionField.enable();
                    this.latitudField.enable();
                    this.longitudField.enable();

                    //Modalidades Turismo Aventura
                    this.modalidadesTurismoAventuraAguaField.disable();
                    this.modalidadesTurismoAventuraAireField.disable();
                    this.modalidadesTurismoAventuraTierraField.disable();
                    break;
                case RolesEnum.GAD:
                    if (this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION) {
                        this.esEditable = false;
                    }
                    this.calleReferenciaField.enable();
                    this.personaContactoTelefonoPrincipalField.enable();
                    this.personaContactoTelefonoSecundarioField.enable();
                    this.personaContactoCorreoField.enable();
                    this.establecimientopaginaWebField.enable();
                    this.tipoLocalField.enable();
                    this.totalHombresField.enable();
                    this.totalMujeresField.enable();
                    this.totalHombresDiscapacidadField.enable();
                    this.totalMujeresDiscapacidadField.enable();
                    //Modalidades Turismo Aventura
                    this.modalidadesTurismoAventuraAguaField.disable();
                    this.modalidadesTurismoAventuraAireField.disable();
                    this.modalidadesTurismoAventuraTierraField.disable();
                    break;
                case RolesEnum.TECNICO_ZONAL:
                    if (this.catastroSeleccionado.estado?.codigo === CatastroEstadoEnum.PENDIENTE_INSPECCION) {
                        this.esEditable = false;
                    }
                    this.calleReferenciaField.enable();
                    this.personaContactoTelefonoPrincipalField.enable();
                    this.personaContactoTelefonoSecundarioField.enable();
                    this.personaContactoCorreoField.enable();
                    this.establecimientopaginaWebField.enable();
                    this.tipoLocalField.enable();
                    this.totalHombresField.enable();
                    this.totalMujeresField.enable();
                    this.totalHombresDiscapacidadField.enable();
                    this.totalMujeresDiscapacidadField.enable();
                    break;
            }
        } else {
            this.formulario.disable();
            this.esEditable = false;
        }
    }

    configurarDpaProvincias() {
        this.provincias = this.dpa.filter((dpa) => dpa.tipo?.codigo === CatalogoSiturinTipoEnum.PROVINCIA);
    }

    configurarDpaCantones(provinciaSeleccionada: DpaModel) {
        if (provinciaSeleccionada?.children) this.cantones = provinciaSeleccionada.children;
    }

    configurarDpaParroquias(cantonSeleccionado: DpaModel) {
        if (cantonSeleccionado?.children) this.parroquias = cantonSeleccionado.children;
    }

    guardarCatastro() {
        if (this.validarFormulario()) {
            this.messageService
                .questionCustom(
                    `¿Está seguro de guardar la información del establecimiento modificado?`,
                    `Recuerde que, todos los cambios efectuados modificarán la información del Catastro Turístico Nacional; además, una vez aceptado se emitrá correos de alerta al usuario y al ${environment.MINISTERIO}`,
                    'Si, Continuar'
                )
                .then((result:any) => {
                    if (result.isConfirmed) {
                        this.catastrosHttpService.guardarCatastroInterno(this.catastroSeleccionado?.id!, this.authService.role?.name!, this.formulario.value).subscribe((catastro) => {
                            this.esVisibleCatastroOut.emit(false);
                            const formData = new FormData();
                            formData.append('archivo', this.archivoField.value);
                            this.catastrosHttpService.guardarAdjuntoCatastroPorDAC(catastro.id!, formData).subscribe((_) => {});
                        });
                    }
                });
        } else {
            this.formulario.markAllAsTouched();
            this.messageService.getErrorsCustom('Por favor complete toda la información', '');
        }
    }

    verificarEstadoInactivo() {
        if (this.estadoField.value.codigo === CatastroEstadoEnum.INACTIVO) {
            this.dialogoCausalesInactivacion = true;
        }
    }

    inactivarTramiteInactivacion(event: boolean) {
        this.dialogoCausalesInactivacion = event;
    }

    removerArchivo() {
        this.archivoField.setValue(null);
    }

    cargarArchivo(event: any) {
        if (event.files.length) {
            this.archivoField.patchValue(event.files[0]);
            // this.archivo = event.files[0];
        }
    }

    validarFormulario(): boolean {
        this.camposInvalidos = [];
        if (!this.formulario.valid) {
            if (!this.observacionesInternoField.valid) {
                this.camposInvalidos.push('Observaciones');
            }

            if (!this.archivoField.valid) {
                this.camposInvalidos.push('Hoja de Planta o Memorando:');
            }
        }

        return this.formulario.valid;
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            numeroRegistro: [{ value: null, disabled: true }],
            fechaRegistro: [{ value: null, disabled: true }],
            sistemaOrigen: [{ value: null, disabled: true }],
            estado: [{ value: null, disabled: true }],
            tramite: this.nuevoFormularioTramite,
            observacionesInterno: [null, [Validators.required]],
            archivo: [null, [Validators.required]]
        });
    }

    get nuevoFormularioTramite() {
        return this.formBuilder.group({
            tipo: [{ value: null, disabled: true }],
            tipoLocal: [{ value: null, disabled: true }],
            actividad: [{ value: null, disabled: true }],
            clasificacion: [{ value: null, disabled: true }],
            categoria: [{ value: null, disabled: true }],
            establecimiento: this.nuevoFormularioEstablecimiento,
            habitaciones: [[]],
            serviciosComplementarios: [[]],
            guiasTurismo: [],
            representantesVentas: [],
            companiasTransporteTuristico: [],
            totalHombres: [{ value: 0, disabled: true }],
            totalHombresDiscapacidad: [{ value: 0, disabled: true }],
            totalMujeres: [{ value: 0, disabled: true }],
            totalMujeresDiscapacidad: [{ value: 0, disabled: true }],
            totalTrabajadores: [{ value: 0, disabled: true }, [Validators.min(1)]],
            alojamiento: [null],
            alimentosBebidas: [null],
            operacionIntermediacion: [null],
            modalidadesTurismoAventura: [[]],
            modalidadesTurismoAventuraAgua: [[]],
            modalidadesTurismoAventuraAire: [[]],
            modalidadesTurismoAventuraTierra: [[]],
            tramiteAlimentoBebida: [],
            tramiteAlojamiento: [],
            tramiteInactivacion: [null],
            pago: [null],
            personeriaJuridica: [{ value: null, disabled: true }]
        });
    }

    get nuevoFormularioEstablecimiento() {
        return this.formBuilder.group({
            canton: [{ value: null, disabled: true }],
            estado: [{ value: null, disabled: true }],
            parroquia: [{ value: null, disabled: true }],
            provincia: [{ value: null, disabled: true }],
            nombreComercial: [{ value: null, disabled: true }],
            numero: [{ value: null, disabled: true }],
            paginaWeb: [{ value: null, disabled: true }],
            personaContacto: this.nuevoFormularioPersonaContacto,
            ubicacion: this.nuevoFormularioUbicacion,
            ruc: [{ value: null, disabled: true }]
        });
    }

    get nuevoFormularioPersonaContacto(): FormGroup {
        return this.formBuilder.group({
            identificacion: [
                {
                    value: null,
                    disabled: true
                },
                [Validators.required, Validators.minLength(10), Validators.maxLength(10)]
            ],
            nombres: [{ value: { value: null, disabled: true }, disabled: true }, [Validators.required]],
            telefonoPrincipal: [
                {
                    value: null,
                    disabled: true
                },
                [Validators.minLength(9), Validators.maxLength(10)]
            ],
            telefonoSecundario: [{ value: null, disabled: true }, [Validators.minLength(9), Validators.maxLength(10)]],
            correo: [
                {
                    value: null,
                    disabled: true
                }
            ],
            correoPropietario: [null]
        });
    }

    get nuevoFormularioUbicacion(): FormGroup {
        return this.formBuilder.group({
            callePrincipal: [{ value: null, disabled: true }],
            calleNumeracion: [{ value: null, disabled: true }],
            calleInterseccion: [{ value: null, disabled: true }],
            calleReferencia: [{ value: null, disabled: true }],
            latitud: [{ value: null, disabled: true }],
            longitud: [{ value: null, disabled: true }]
        });
    }

    //Catastro
    get numeroRegistroField() {
        return this.formulario.controls['numeroRegistro'];
    }

    get fechaRegistroField() {
        return this.formulario.controls['fechaRegistro'];
    }

    get sistemaOrigenField() {
        return this.formulario.controls['sistemaOrigen'];
    }

    get estadoField(): FormGroup {
        return this.formulario.controls['estado'] as FormGroup;
    }

    get observacionesInternoField() {
        return this.formulario.controls['observacionesInterno'];
    }

    get archivoField() {
        return this.formulario.controls['archivo'];
    }

    //Tramite
    get tramiteField(): FormGroup {
        return this.formulario.controls['tramite'] as FormGroup;
    }

    get tramiteAlimentoBebidaField() {
        return this.tramiteField.controls['tramiteAlimentoBebida'];
    }

    get tramiteAlojamientoField() {
        return this.tramiteField.controls['tramiteAlojamiento'];
    }

    get tipoLocalField() {
        return this.tramiteField.controls['tipoLocal'];
    }

    get actividadField() {
        return this.tramiteField.controls['actividad'];
    }

    get clasificacionField() {
        return this.tramiteField.controls['clasificacion'];
    }

    get categoriaField() {
        return this.tramiteField.controls['categoria'];
    }

    get habitacionesField() {
        return this.tramiteField.controls['habitaciones'];
    }

    get serviciosComplementariosField() {
        return this.tramiteField.controls['serviciosComplementarios'];
    }

    get tramiteInactivacionField() {
        return this.tramiteField.controls['tramiteInactivacion'];
    }

    //Establecimiento
    get establecimientoField(): FormGroup {
        return this.tramiteField.controls['establecimiento'] as FormGroup;
    }

    get establecimientoNombreComercialField() {
        return this.establecimientoField.controls['nombreComercial'];
    }

    get establecimientoEstadoField() {
        return this.establecimientoField.controls['estado'];
    }

    get establecimientopaginaWebField() {
        return this.establecimientoField.controls['paginaWeb'];
    }

    get establecimientoNumeroField() {
        return this.establecimientoField.controls['numero'];
    }

    get provinciaField(): AbstractControl {
        return this.establecimientoField.controls['provincia'];
    }

    get cantonField(): AbstractControl {
        return this.establecimientoField.controls['canton'];
    }

    get parroquiaField(): AbstractControl {
        return this.establecimientoField.controls['parroquia'];
    }

    get rucField(): AbstractControl {
        return this.establecimientoField.controls['ruc'];
    }

    get correoPropietarioField() {
        return this.establecimientoField.controls['ruc'].value?.user?.email;
    }

    get pagoField() {
        return this.establecimientoField.controls['ruc'].value?.pago;
    }

    //Ubicacion
    get ubicacionField(): UntypedFormGroup {
        return this.establecimientoField.controls['ubicacion'] as UntypedFormGroup;
    }

    get callePrincipalField(): AbstractControl {
        return this.ubicacionField.controls['callePrincipal'];
    }

    get calleNumeracionField(): AbstractControl {
        return this.ubicacionField.controls['calleNumeracion'];
    }

    get calleIntereseccionField(): AbstractControl {
        return this.ubicacionField.controls['calleInterseccion'];
    }

    get calleReferenciaField(): AbstractControl {
        return this.ubicacionField.controls['calleReferencia'];
    }

    get latitudField(): AbstractControl {
        return this.ubicacionField.controls['latitud'];
    }

    get longitudField(): AbstractControl {
        return this.ubicacionField.controls['longitud'];
    }

    //Persona de Contacto
    get personaContactoField(): FormGroup {
        return this.establecimientoField.controls['personaContacto'] as FormGroup;
    }

    get personaContactoIdentificacionField(): AbstractControl {
        return this.personaContactoField.controls['identificacion'];
    }

    get personaContactoNombresField(): AbstractControl {
        return this.personaContactoField.controls['nombres'];
    }

    get personaContactoTelefonoPrincipalField(): AbstractControl {
        return this.personaContactoField.controls['telefonoPrincipal'];
    }

    get personaContactoTelefonoSecundarioField(): AbstractControl {
        return this.personaContactoField.controls['telefonoSecundario'];
    }

    get personaContactoCorreoField(): AbstractControl {
        return this.personaContactoField.controls['correo'];
    }

    get totalTrabajadoresField(): AbstractControl {
        return this.tramiteField.controls['totalTrabajadores'];
    }

    get totalHombresField(): AbstractControl {
        return this.tramiteField.controls['totalHombres'];
    }

    get totalHombresDiscapacidadField(): AbstractControl {
        return this.tramiteField.controls['totalHombresDiscapacidad'];
    }

    get totalMujeresField(): AbstractControl {
        return this.tramiteField.controls['totalMujeres'];
    }

    get totalMujeresDiscapacidadField(): AbstractControl {
        return this.tramiteField.controls['totalMujeresDiscapacidad'];
    }

    get alojamientoField() {
        return this.tramiteField.controls['alojamiento'];
    }

    get alimentosBebidasField() {
        return this.tramiteField.controls['alimentosBebidas'];
    }

    get operacionIntermediacionField() {
        return this.tramiteField.controls['operacionIntermediacion'];
    }

    get companiasTransporteTuristicoField() {
        return this.tramiteField.controls['companiasTransporteTuristico'];
    }

    get guiasTurismoField() {
        return this.tramiteField.controls['guiasTurismo'];
    }

    get representantesVentasField() {
        return this.tramiteField.controls['representantesVentas'];
    }

    get modalidadesTurismoAventuraField() {
        return this.tramiteField.controls['modalidadesTurismoAventura'];
    }

    get modalidadesTurismoAventuraAguaField() {
        return this.tramiteField.controls['modalidadesTurismoAventuraAgua'];
    }

    get modalidadesTurismoAventuraAireField() {
        return this.tramiteField.controls['modalidadesTurismoAventuraAire'];
    }

    get modalidadesTurismoAventuraTierraField() {
        return this.tramiteField.controls['modalidadesTurismoAventuraTierra'];
    }

    get personeriaJuridicaField(): AbstractControl {
        return this.tramiteField.controls['personeriaJuridica'];
    }

    protected readonly CatastroEstadoEnum = CatastroEstadoEnum;
}
