import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { NgIf, NgFor } from '@angular/common';
import { Panel } from 'primeng/panel';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { InputText } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { NormativaComponent } from '../../../compartido/normativa/normativa.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Dialog } from 'primeng/dialog';
import { ProgressBarComponent } from '../../../../../legacy/shared/components/progress-bar/progress-bar.component';

import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { CatalogoModel, ClasificacionModel, EstablecimientoModel, ModalidadTurismoAventuraModel, TramiteModel } from '@/legacy/models/siturin';
import { CatalogosSiturinHttpService, CatalogosSiturinService, CatastrosHttpService, CategoriasHttpService, ClasificacionesHttpService, EstablecimientosService, TramitesHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { CatalogoSiturinTipoEnum, ClasificacionCodigoEnum, EstablecimientoTipoEnum, TramiteTiposEnum, ZonaGeograficaCodigoEnum } from '@/legacy/shared/enums';
@Component({
    selector: 'app-normativa-alimentos-bebidas',
    templateUrl: './normativa-alimentos-bebidas.component.html',
    styleUrls: ['./normativa-alimentos-bebidas.component.scss'],
    imports: [Bind, Divider, NgIf, Panel, ReactiveFormsModule, LabelDirective, ToggleSwitch, ErrorMessageDirective, InputText, MultiSelect, NormativaComponent, NgFor, ButtonDirective, Ripple, Dialog, ProgressBarComponent, InputNumber, Select]
})
export class NormativaAlimentosBebidasComponent implements OnInit {
    @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();
    @Input() actividad: AbstractControl = new FormControl();
    @Input() clasificacion: AbstractControl = new FormControl();

    private catastrosHttpService = inject(CatastrosHttpService);
    private formBuilder = inject(FormBuilder);
    private catalogosSiturinService = inject(CatalogosSiturinService);
    private catalogosSiturinHttpService = inject(CatalogosSiturinHttpService);
    private categoriasHttpService = inject(CategoriasHttpService);
    private clasificacionesHttpService = inject(ClasificacionesHttpService);
    private coreService = inject(CoreService);
    private establecimientosService = inject(EstablecimientosService);
    public messageService = inject(MessageService);
    private tramitesHttpService = inject(TramitesHttpService);
    private router = inject(Router);

    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
    clasificaciones: ClasificacionModel[] = [];
    formulario: FormGroup = this.nuevoFormulario;
    modalidadesTurismoAventura: ModalidadTurismoAventuraModel[] = [];
    modalidadesTurismoAventuraAgua: CatalogoModel[] = [];
    modalidadesTurismoAventuraAire: CatalogoModel[] = [];
    modalidadesTurismoAventuraTierra: CatalogoModel[] = [];
    tipoEstablecimientos: CatalogoModel[] = [];
    tiposServicio: CatalogoModel[] = [];
    tiposCocina: CatalogoModel[] = [];
    cargado$ = this.coreService.loaded$;
    totalHabitaciones: number = 0;
    totalPlazas: number = 0;
    mostrarDialogoNuevaHabitacion: boolean = false;
    mostrarDialogoNuevoServicioComplementario: boolean = false;
    formularioValido: boolean = false;
    normativaRespuestas: any[] = [];
    indexServicioComplementario: number = -1;
    camposInvalidos: string[] = [];
    dialogoCrearTramite: boolean = false;
    esCambioUbicacion: boolean = false;

    constructor() {}

    ngOnInit(): void {
        if (
            (sessionStorage.getItem('esCambioUbicacion') == 'true' ||
                this.establecimientoSeleccionado?.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REGISTRO ||
                this.establecimientoSeleccionado?.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REINGRESO) &&
            this.establecimientoSeleccionado.tramiteActual?.clasificacion?.codigo !== ClasificacionCodigoEnum.ESTABLECIMIENTO_MOVIL
        ) {
            this.usoSuelosField.setValue(false);
            this.usoSuelosField.setValidators(Validators.requiredTrue);
            this.esCambioUbicacion = true;
        } else {
            this.usoSuelosField.setValue(false);
            this.usoSuelosField.setValidators(null);
        }

        if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.usoSuelos = this.usoSuelosField.value;

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.tramiteAlimentoBebida = {};
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }

        this.formulario.valueChanges.subscribe(() => {
            if (this.establecimientoSeleccionado?.tramiteActual) {
                this.establecimientoSeleccionado.tramiteActual.clasificacion = this.establecimientosService.establecimiento.tramiteActual?.clasificacion;
                this.establecimientoSeleccionado.tramiteActual.categoria = this.establecimientosService.establecimiento.tramiteActual?.categoria;
            }
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        });

        this.tieneModalidadesTurismoAventuraField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventuraField.clearValidators();

            if (value) {
                this.modalidadesTurismoAventuraField.setValidators(Validators.required);
                this.obtenerModalidadesTurismoAventura();
            }

            this.modalidadesTurismoAventuraField.updateValueAndValidity();

            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.tieneModalidadesTurismoAventura = value;

            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

            this.validarFormulario();
        });

        this.usoSuelosField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.usoSuelos = value;
        });

        this.modalidadesTurismoAventuraAguaField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventura = [];
            if (this.modalidadesTurismoAventuraAguaField.value) {
                this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(this.modalidadesTurismoAventuraAireField.value, this.modalidadesTurismoAventuraTierraField.value);
            }
            if (this.establecimientoSeleccionado.tramiteActual && value) this.establecimientoSeleccionado.tramiteActual.modalidadesTurismoAventura = this.modalidadesTurismoAventura;

            this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            this.validarFormulario();
        });

        this.modalidadesTurismoAventuraAireField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventura = [];
            if (this.modalidadesTurismoAventuraAireField.value) {
                this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(this.modalidadesTurismoAventuraAireField.value, this.modalidadesTurismoAventuraTierraField.value);
            }

            if (this.establecimientoSeleccionado.tramiteActual && value) this.establecimientoSeleccionado.tramiteActual.modalidadesTurismoAventura = this.modalidadesTurismoAventura;

            this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            this.validarFormulario();
        });

        this.modalidadesTurismoAventuraTierraField.valueChanges.subscribe((value) => {
            this.modalidadesTurismoAventura = [];
            if (this.modalidadesTurismoAventuraTierraField.value) {
                this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(this.modalidadesTurismoAventuraAireField.value, this.modalidadesTurismoAventuraTierraField.value);
            }
            if (this.establecimientoSeleccionado.tramiteActual && value) this.establecimientoSeleccionado.tramiteActual.modalidadesTurismoAventura = this.modalidadesTurismoAventura;

            this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            this.validarFormulario();
        });

        this.tipoEstablecimientoField.valueChanges.subscribe((value) => {
            this.nombreEstablecimientoField.clearValidators();
            this.tieneCertificadoConcesionFranquiciaField.clearValidators();

            if (value?.codigo === EstablecimientoTipoEnum.CADENA) {
                this.nombreEstablecimientoField.setValidators([Validators.required]);
            }

            if (value?.codigo === EstablecimientoTipoEnum.FRANQUICIA) {
                this.nombreEstablecimientoField.setValidators([Validators.required]);
                this.tieneCertificadoConcesionFranquiciaField.setValidators([Validators.requiredTrue]);
            }

            if (this.establecimientoSeleccionado.tramiteActual && value) {
                this.establecimientoSeleccionado.tramiteActual.tramiteAlimentoBebida = { tipoEstablecimiento: value };
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }

            this.nombreEstablecimientoField.updateValueAndValidity();
            this.tieneCertificadoConcesionFranquiciaField.updateValueAndValidity();
        });

        this.nombreEstablecimientoField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual?.tramiteAlimentoBebida && value) {
                this.establecimientoSeleccionado.tramiteActual.tramiteAlimentoBebida.nombreEstablecimiento = value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }
        });

        this.tieneCertificadoConcesionFranquiciaField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual?.tramiteAlimentoBebida && value) {
                this.establecimientoSeleccionado.tramiteActual.tramiteAlimentoBebida.tieneCertificadoConcesionFranquicia = value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }
        });

        this.totalCapacidadesField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual?.tramiteAlimentoBebida && value) {
                this.establecimientoSeleccionado.tramiteActual.tramiteAlimentoBebida.totalCapacidades = value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }
        });

        this.totalMesasField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual?.tramiteAlimentoBebida && value) {
                this.establecimientoSeleccionado.tramiteActual.tramiteAlimentoBebida.totalMesas = value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }
        });

        this.tiposCocinaField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual?.tramiteAlimentoBebida && value) {
                this.establecimientoSeleccionado.tramiteActual.tramiteAlimentoBebida.tiposCocina = value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }
        });

        this.tiposServicioField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual?.tramiteAlimentoBebida && value) {
                this.establecimientoSeleccionado.tramiteActual.tramiteAlimentoBebida.tiposServicio = value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }
        });

        this.obtenerTipoEstablecimientos();
        this.obtenerTiposCocina();
        this.obtenerTiposServicio();
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            normativaRespuestas: [[]],
            normativaRespuestasModalidadesTurismoAventura: [[]],
            modalidadesTurismoAventura: [[]],
            modalidadesTurismoAventuraAgua: [[]],
            modalidadesTurismoAventuraAire: [[]],
            modalidadesTurismoAventuraTierra: [[]],
            tieneModalidadesTurismoAventura: [false],
            usoSuelos: [false, [Validators.requiredTrue]],
            tramiteAlimentoBebida: this.nuevoFormularioTramiteAlimentoBebida
        });
    }

    get nuevoFormularioTramiteAlimentoBebida() {
        return this.formBuilder.group({
            tieneCertificadoConcesionFranquicia: [false, []],
            tiposCocina: [[]],
            tipoEstablecimiento: [null, [Validators.required]],
            nombreEstablecimiento: [null],
            tiposServicio: [[]],
            totalCapacidades: [0, [Validators.required, Validators.min(1)]],
            totalMesas: [0, [Validators.required, Validators.min(1)]]
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
                    this.tramitesHttpService.guardarTramiteAlimentoBebidaContinente(this.establecimientosService.establecimiento).subscribe(
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

            this.catastrosHttpService.obtenerDocumentoUsuarioExterno(catastro.id!, 'check_list_externo').subscribe((documento) => {
                this.coreService.descargarDocumentoPDF(documento, 'check_list_' + catastro.numeroRegistro);
            });
        }
    }

    validarFormulario(): boolean {
        this.camposInvalidos = [];

        if (!this.formulario.valid) {
            if (!this.nombreEstablecimientoField.valid) {
                this.camposInvalidos.push('Tipo de Establecimiento');
            }

            if (!this.tieneCertificadoConcesionFranquiciaField.valid) {
                this.camposInvalidos.push('Tiene Certificado Concesion Franquicia');
            }

            if (!this.totalCapacidadesField.valid) {
                this.camposInvalidos.push('Capacidad en número de personas');
            }

            if (!this.totalMesasField.valid) {
                this.camposInvalidos.push('Total Mesas');
            }

            if (!this.tiposCocinaField.valid) {
                this.camposInvalidos.push('Tipos Cocinas');
            }

            if (!this.tiposServicioField.valid) {
                this.camposInvalidos.push('Tipos Servicios');
            }

            if (!this.modalidadesTurismoAventuraField.valid) {
                this.camposInvalidos.push('Modalidades Turismo Aventura');
            }
        }

        if (this.normativaRespuestas.length === 0 && this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo != TramiteTiposEnum.ACTUALIZACION) {
            this.camposInvalidos.push('Normativa');
        }

        return this.camposInvalidos.length === 0 && this.formulario.valid;
    }

    obtenerClasificaciones() {
        this.clasificacionesHttpService.obtenerClasificacionesParaServiciosComplementarios('alimentos_bebidas_continente').subscribe((clasificaciones) => {
            this.clasificaciones = clasificaciones;
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

    obtenerTipoEstablecimientos() {
        this.tipoEstablecimientos = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TRAMITE_TIPOS_ESTABLECIMIENTOS);
    }

    obtenerTiposCocina() {
        const tramiteTiposCocinas = this.actividad.value?.zonaGeografica?.codigo === ZonaGeograficaCodigoEnum.CONTINENTE ? CatalogoSiturinTipoEnum.TRAMITE_TIPOS_COCINAS_CONTINENTE : CatalogoSiturinTipoEnum.TRAMITE_TIPOS_COCINAS_GALAPAGOS;

        this.catalogosSiturinHttpService.obtenerCatalogosPorClasificacion(this.clasificacion.value.id, tramiteTiposCocinas).subscribe((catalogos) => {
            this.tiposCocina = catalogos;
            if (catalogos.length > 0) {
                this.tiposCocinaField.setValidators(Validators.required);
                this.tiposCocinaField.updateValueAndValidity();
            }
        });
    }

    obtenerTiposServicio() {
        const tramiteTiposServicios = this.actividad.value?.zonaGeografica?.codigo === ZonaGeograficaCodigoEnum.CONTINENTE ? CatalogoSiturinTipoEnum.TRAMITE_TIPOS_SERVICIOS_CONTINENTE : CatalogoSiturinTipoEnum.TRAMITE_TIPOS_SERVICIOS_GALAPAGOS;

        this.catalogosSiturinHttpService.obtenerCatalogosPorClasificacion(this.clasificacion.value.id, tramiteTiposServicios).subscribe((catalogos) => {
            this.tiposServicio = catalogos;
            if (catalogos.length > 0) {
                this.tiposServicioField.setValidators(Validators.required);
                this.tiposServicioField.updateValueAndValidity();
            }
        });
    }

    llenarNormativaRespuestas(normativaRespuestas: any[]) {
        this.normativaRespuestas = normativaRespuestas;
        if (this.establecimientoSeleccionado.tramiteActual) {
            this.normativaRespuestasField.setValue(normativaRespuestas);
            this.establecimientoSeleccionado.tramiteActual.normativaRespuestas = normativaRespuestas;
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }
        this.validarFormulario();
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

    get normativaRespuestasField() {
        return this.formulario.controls['normativaRespuestas'];
    }

    get usoSuelosField() {
        return this.formulario.controls['usoSuelos'];
    }

    get tramiteAlimentoBebidaField(): FormGroup {
        return this.formulario.controls['tramiteAlimentoBebida'] as FormGroup;
    }

    get tieneCertificadoConcesionFranquiciaField() {
        return this.tramiteAlimentoBebidaField.controls['tieneCertificadoConcesionFranquicia'];
    }

    get tiposCocinaField() {
        return this.tramiteAlimentoBebidaField.controls['tiposCocina'];
    }

    get tipoEstablecimientoField() {
        return this.tramiteAlimentoBebidaField.controls['tipoEstablecimiento'];
    }

    get nombreEstablecimientoField() {
        return this.tramiteAlimentoBebidaField.controls['nombreEstablecimiento'];
    }

    get tiposServicioField() {
        return this.tramiteAlimentoBebidaField.controls['tiposServicio'];
    }

    get totalCapacidadesField() {
        return this.tramiteAlimentoBebidaField.controls['totalCapacidades'];
    }

    get totalMesasField() {
        return this.tramiteAlimentoBebidaField.controls['totalMesas'];
    }

    protected readonly environment = environment;
}
