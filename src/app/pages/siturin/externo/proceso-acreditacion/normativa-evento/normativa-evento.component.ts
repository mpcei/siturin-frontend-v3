import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { NgIf, NgFor } from '@angular/common';
import { Panel } from 'primeng/panel';
import { NormativaComponent } from '../../../compartido/normativa/normativa.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Dialog } from 'primeng/dialog';
import { ProgressBarComponent } from '../../../../../legacy/shared/components/progress-bar/progress-bar.component';

import { InputNumber } from 'primeng/inputnumber';
import { CatalogoModel, ClasificacionModel, EstablecimientoModel, ModalidadTurismoAventuraModel, TramiteModel } from '@/legacy/models/siturin';
import { CatalogosSiturinService, CatastrosHttpService, EstablecimientosService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { TramiteEventosHttpService } from '@/legacy/services/siturin/tramite-eventos-http.service';
import { Router } from '@angular/router';
import { CatalogoSiturinTipoEnum, ClasificacionCodigoEnum, TramiteTiposEnum } from '@/legacy/shared/enums';
@Component({
    selector: 'app-normativa-evento',
    templateUrl: './normativa-evento.component.html',
    styleUrls: ['./normativa-evento.component.scss'],
    imports: [Bind, Divider, ReactiveFormsModule, LabelDirective, ToggleSwitch, ErrorMessageDirective, NgIf, Panel, NormativaComponent, NgFor, ButtonDirective, Ripple, Dialog, ProgressBarComponent, InputNumber]
})
export class NormativaEventoComponent implements OnInit {
    @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();
    @Input() actividad: AbstractControl = new FormControl();
    @Input() clasificacion: AbstractControl = new FormControl();
    @Input() categoria: AbstractControl = new FormControl();

    private catastrosHttpService = inject(CatastrosHttpService);
    private formBuilder = inject(FormBuilder);
    private catalogosSiturinService = inject(CatalogosSiturinService);
    private coreService = inject(CoreService);
    private establecimientosService = inject(EstablecimientosService);
    public messageService = inject(MessageService);
    private tramiteEventosHttpService = inject(TramiteEventosHttpService);
    private router = inject(Router);
    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
    clasificaciones: ClasificacionModel[] = [];
    formulario: FormGroup = this.nuevoFormulario;
    modalidadesTurismoAventura: ModalidadTurismoAventuraModel[] = [];
    modalidadesTurismoAventuraAgua: CatalogoModel[] = [];
    modalidadesTurismoAventuraAire: CatalogoModel[] = [];
    modalidadesTurismoAventuraTierra: CatalogoModel[] = [];
    tipoEstablecimientos: CatalogoModel[] = [];
    cargado$ = this.coreService.loaded$;
    totalHabitaciones: number = 0;
    totalPlazas: number = 0;
    mostrarDialogoNuevaHabitacion: boolean = false;
    normativaRespuestas: any[] = [];
    camposInvalidos: string[] = [];
    dialogoCrearTramite: boolean = false;
    esCambioUbicacion: boolean = false;

    constructor() {
        this.esAreaProtegidaField.valueChanges.subscribe((value) => {
            if (value) {
                this.contratoAreaProtegidaField.setValidators(Validators.requiredTrue);
            } else {
                this.contratoAreaProtegidaField.clearValidators();
            }
            this.contratoAreaProtegidaField.updateValueAndValidity();
        });
    }

    ngOnInit(): void {
        if (
            (sessionStorage.getItem('esCambioUbicacion') == 'true' ||
                this.establecimientoSeleccionado?.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REGISTRO ||
                this.establecimientoSeleccionado?.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REINGRESO) &&
            this.establecimientoSeleccionado.tramiteActual?.clasificacion?.codigo !== ClasificacionCodigoEnum.ESTABLECIMIENTO_MOVIL
        ) {
            this.esCambioUbicacion = true;
        }

        if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.usoSuelos = this.usoSuelosField.value;

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.tramiteParque = {};
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

        this.totalCapacidadesField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual?.tramiteParque && value) {
                this.establecimientoSeleccionado.tramiteActual.tramiteParque.totalCapacidades = value;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }
        });

        this.obtenerTipoEstablecimientos();

        if (this.clasificacion.value.codigo == ClasificacionCodigoEnum.EVENTOS) {
            this.totalCapacidadesField.clearValidators();
            this.totalCapacidadesField.updateValueAndValidity();
        }
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            establecimiento: [this.establecimientoSeleccionado],
            normativaRespuestas: [[]],
            normativaRespuestasModalidadesTurismoAventura: [[]],
            modalidadesTurismoAventura: [[]],
            modalidadesTurismoAventuraAgua: [[]],
            modalidadesTurismoAventuraAire: [[]],
            modalidadesTurismoAventuraTierra: [[]],
            tieneModalidadesTurismoAventura: [false],
            usoSuelos: [false],
            esAreaProtegida: false,
            contratoAreaProtegida: false,
            totalCapacidades: [0, [Validators.required, Validators.min(1)]]
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

                    this.tramiteEventosHttpService.guardarTramiteContinente(this.formulario.value).subscribe(
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
            if (!this.totalCapacidadesField.valid) {
                this.camposInvalidos.push('Capacidad en número de personas');
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

    get tramiteParqueField(): FormGroup {
        return this.formulario.controls['tramiteParque'] as FormGroup;
    }

    get totalCapacidadesField() {
        return this.formulario.controls['totalCapacidades'];
    }

    get esAreaProtegidaField() {
        return this.formulario.controls['esAreaProtegida'];
    }

    get contratoAreaProtegidaField() {
        return this.formulario.controls['contratoAreaProtegida'];
    }

    protected readonly ClasificacionCodigoEnum = ClasificacionCodigoEnum;
}
