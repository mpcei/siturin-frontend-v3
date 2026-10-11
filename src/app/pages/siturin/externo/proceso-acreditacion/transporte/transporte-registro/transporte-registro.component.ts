import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { LabelDirective } from '../../../../../../legacy/shared/directives/label.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ErrorMessageDirective } from '../../../../../../legacy/shared/directives/error-message.directive';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Dialog } from 'primeng/dialog';
import { ProgressBarComponent } from '../../../../../../legacy/shared/components/progress-bar/progress-bar.component';
import { Popover } from 'primeng/popover';

import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { CoreService, MessageService } from '@/legacy/services/core';
import { CatalogosSiturinService, CatastrosHttpService, EstablecimientosService, TransportesHttpService } from '@/legacy/services/siturin';
import { CatalogoModel, CompaniaTransporteTuristicoModel, EstablecimientoModel, TramiteModel } from '@/legacy/models/siturin';
import { ColumnModel } from '@/legacy/models/core';
import { CatalogoSiturinTipoEnum, ClasificacionCodigoEnum, TramiteTransporteTipoAerolineasEnum, TramiteTransporteTipoLocalesEnum } from '@/legacy/shared/enums';
@Component({
    selector: 'app-transporte-registro',
    templateUrl: './transporte-registro.component.html',
    styleUrls: ['./transporte-registro.component.scss'],
    imports: [
        Bind,
        Panel,
        ReactiveFormsModule,
        LabelDirective,
        ToggleSwitch,
        ErrorMessageDirective,
        NgIf,
        InputText,
        DatePicker,
        TableModule,
        PrimeTemplate,
        ButtonDirective,
        NgFor,
        Ripple,
        Dialog,
        ProgressBarComponent,
        Popover,
        DatePipe,
        InputNumber,
        Select
    ]
})
export class TransporteRegistroComponent implements OnInit {
    @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();

    private coreService = inject(CoreService);
    private establecimientosService = inject(EstablecimientosService);
    private formBuilder = inject(FormBuilder);
    protected messageService = inject(MessageService);
    private catalogosSiturinService = inject(CatalogosSiturinService);
    private transportesHttpService = inject(TransportesHttpService);
    private catastrosHttpService = inject(CatastrosHttpService);
    private router = inject(Router);
    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
    formulario: FormGroup = this.nuevoFormulario;
    formularioTransporteTerrestre: FormGroup = this.nuevoFormularioTransporteTerrestre;
    aerolineaTipos: CatalogoModel[] = [];
    tipoLocales: CatalogoModel[] = [];
    tipoTransporteTerrestres: CatalogoModel[] = [];
    certificadoLabel: string = '';
    codigoCertificadoLabel: string = '';
    fechaEmisionCertificadoLabel: string = '';
    fechaCaducidadCertificadoLabel: string = '';
    columnasVehiculosTabla: ColumnModel[] = this.configurarColumnasVehiculosTabla();
    dialogoNuevoTransporteTerrestre: boolean = false;
    indexTransporteTerrestre: number = -1;
    dialogoCrearTramite: boolean = false;

    constructor() {
        this.esAreaProtegidaField.valueChanges.subscribe((value) => {
            if (value) {
                this.contratoAreaProtegidaField.setValidators(Validators.requiredTrue);
            } else {
                this.contratoAreaProtegidaField.clearValidators();
            }
            this.contratoAreaProtegidaField.updateValueAndValidity();
        });

        this.tipoAerolineaField.valueChanges.subscribe((value) => {
            if (value?.codigo === TramiteTransporteTipoAerolineasEnum.NACIONAL) {
                this.tipoLocales = this.tipoLocales.filter((tipoLocal) => tipoLocal.codigo !== TramiteTransporteTipoLocalesEnum.NINGUNO);
            } else {
                this.obtenerTipoLocales();
            }
        });
    }

    ngOnInit(): void {
        switch (this.establecimientoSeleccionado.tramiteActual?.clasificacion?.codigo) {
            case ClasificacionCodigoEnum.AEREO:
                this.certificadoLabel = 'Certificado de Operador Aéreo (AOC) o Reconocimiento de Certificado de Operador Aéreo (AOCR) emitido por la Dirección General de Aviación Civil.';
                this.codigoCertificadoLabel = 'Número o Código del Certificado de Operador Aéreo (AOC) o Reconocimiento de Certificado de Operador Aéreo (AOCR):';
                this.fechaEmisionCertificadoLabel = 'Fecha de emisión del Certificado de Operador Aéreo (AOC) o Reconocimiento de Certificado de Operador Aéreo (AOCR):';
                this.fechaCaducidadCertificadoLabel = 'Fecha de caducidad del Certificado de Operador Aéreo (AOC) o Reconocimiento de Certificado de Operador Aéreo (AOCR):';
                break;
            case ClasificacionCodigoEnum.TERRESTRE:
                this.certificadoLabel = 'Título habilitante de transporte terrestre comercial de turismo vigente, otorgado por la Autoridad competente.';
                this.codigoCertificadoLabel = 'Número o Código del Título habilitante:';
                this.fechaEmisionCertificadoLabel = 'Fecha de emisión del Título habilitante:';
                this.fechaCaducidadCertificadoLabel = 'Fecha de caducidad del Título habilitante:';
                break;
            case ClasificacionCodigoEnum.MARITIMO:
                this.certificadoLabel = 'Matrícula de Armador otorgada por el Ministerio de Transporte y Obras Públicas y la matrícula de cada una de las embarcaciones.';
                this.codigoCertificadoLabel = 'Número o Código de la Matrícula de Armador:';
                this.fechaEmisionCertificadoLabel = 'Fecha de emisión de la Matrícula de Armador:';
                this.fechaCaducidadCertificadoLabel = 'Fecha de Caducidad de la Matrícula de Armador:';
                break;
        }

        this.obtenerAerolineaTipos();
        this.obtenerTipoLocales();
        this.obtenerTipoTransporteTerrestres();

        if (this.establecimientoSeleccionado.tramiteActual?.clasificacion?.codigo === ClasificacionCodigoEnum.AEREO) {
            this.tipoAerolineaField.setValidators(Validators.required);
        } else {
            this.tipoAerolineaField.clearValidators();
        }

        if (this.establecimientoSeleccionado.tramiteActual?.clasificacion?.codigo === ClasificacionCodigoEnum.MARITIMO) {
            this.totalUnidadesField.setValidators([Validators.required, Validators.min(1)]);
            this.totalAsientosField.setValidators([Validators.required, Validators.min(1)]);
        } else {
            this.totalUnidadesField.clearValidators();
            this.totalAsientosField.clearValidators();
        }
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            establecimiento: [this.establecimientoSeleccionado],
            esAreaProtegida: [false],
            contratoAreaProtegida: [false],
            tipoLocal: [null, [Validators.required]],
            tipoAerolinea: [null],
            certificado: [false, [Validators.requiredTrue]],
            codigoCertificado: [null, [Validators.required]],
            fechaEmisionCertificado: [null, [Validators.required]],
            fechaCaducidadCertificado: [null, [Validators.required]],
            totalUnidades: [0],
            totalAsientos: [0],
            transporteTerrestres: [[]]
        });
    }

    get nuevoFormularioTransporteTerrestre() {
        return this.formBuilder.group({
            tipo: [null, [Validators.required]],
            placa: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
            matricula: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(7)]],
            fechaMatricula: [null, [Validators.required]],
            fechaCaducidadMatricula: [null, [Validators.required]],
            capacidad: [0, [Validators.required, Validators.min(1)]]
        });
    }

    configurarColumnasVehiculosTabla(): ColumnModel[] {
        return [
            { field: 'tipo', header: 'Tipo' },
            { field: 'placa', header: 'Placa' },
            { field: 'matricula', header: 'Formulario Matrícula' },
            { field: 'fechaMatricula', header: 'Fecha de emisión de la matrícula' },
            { field: 'fechaCaducidadMatricula', header: 'Fecha de caducidad de la matrícula' },
            { field: 'capacidad', header: 'Capacidad de la Unidad' }
        ];
    }

    onSubmit(): void {
        if (this.formulario.valid) {
            this.guardarTramite();
        } else {
            this.formulario.markAllAsTouched();
            this.messageService.errorsFields.then();
        }
    }

    guardarTramite() {
        if (this.formulario.valid) {
            this.messageService
                .questionCustom(
                    `¿Está seguro de gestionar el trámite “${this.establecimientoSeleccionado.tramiteActual?.tipo?.nombre}” ante el ${environment.MINISTERIO}?`,
                    `Recuerde que, una vez enviada la información, esta será verificada mediante inspección.”`,
                    'Si, Gestionar'
                )
                .then((result) => {
                    if (result.isConfirmed) {
                        this.dialogoCrearTramite = true;
                        this.transportesHttpService.guardarTramiteContinente(this.formulario.value).subscribe(
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

    obtenerAerolineaTipos() {
        this.aerolineaTipos = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.AEROLINEA_TIPOS);
    }

    obtenerTipoLocales() {
        this.tipoLocales = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TRANSPORTE_TIPO_LOCALES);
        if (this.establecimientoSeleccionado.tramiteActual?.clasificacion?.codigo !== ClasificacionCodigoEnum.AEREO) {
            this.tipoLocales = this.tipoLocales.filter((tipoLocal) => tipoLocal.codigo != TramiteTransporteTipoLocalesEnum.NINGUNO);
        }
    }

    obtenerTipoTransporteTerrestres() {
        this.tipoTransporteTerrestres = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TRANSPORTE_TIPO_VEHICULOS);
    }

    mostrarDialogoNuevoTipoVehiculo() {
        this.dialogoNuevoTransporteTerrestre = true;
        this.indexTransporteTerrestre = -1;
        this.formularioTransporteTerrestre.reset();
    }

    agregarTransporteTerrestre() {
        if (this.formularioTransporteTerrestre.valid) {
            const companias: any[] = this.transporteTerrestresField.value;

            if (companias.find((compania) => compania.ruc === this.placaField.value)) {
                this.dialogoNuevoTransporteTerrestre = false;
                this.messageService.getInfoCustom('El tipo de vehículo ya existe', 'Por favor modifique');
                return;
            }

            if (this.indexTransporteTerrestre > -1) {
                this.transporteTerrestresField.value[this.indexTransporteTerrestre] = this.formularioTransporteTerrestre.value;
            } else {
                this.transporteTerrestresField.value.push(this.formularioTransporteTerrestre.value);
            }

            this.dialogoNuevoTransporteTerrestre = false;
            this.transporteTerrestresField.updateValueAndValidity();
        } else {
            this.formularioTransporteTerrestre.markAllAsTouched();
        }
    }

    editarTransporteTerrestre(companiaTransporteTuristico: CompaniaTransporteTuristicoModel, index: number) {
        this.dialogoNuevoTransporteTerrestre = true;
        this.indexTransporteTerrestre = index;
        this.formularioTransporteTerrestre.patchValue(companiaTransporteTuristico);
    }

    eliminarTransporteTerrestre(index: number) {
        this.transporteTerrestresField.value.splice(index, 1);
        this.transporteTerrestresField.updateValueAndValidity();
        if (this.establecimientoSeleccionado.tramiteActual) {
            this.establecimientoSeleccionado.tramiteActual.companiasTransporteTuristico = this.transporteTerrestresField.value;
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }
    }

    get esAreaProtegidaField() {
        return this.formulario.controls['esAreaProtegida'];
    }

    get contratoAreaProtegidaField() {
        return this.formulario.controls['contratoAreaProtegida'];
    }

    get tipoLocalField() {
        return this.formulario.controls['tipoLocal'];
    }

    get tipoAerolineaField() {
        return this.formulario.controls['tipoAerolinea'];
    }

    get certificadoField() {
        return this.formulario.controls['certificado'];
    }

    get codigoCertificadoField() {
        return this.formulario.controls['codigoCertificado'];
    }

    get fechaEmisionCertificadoField() {
        return this.formulario.controls['fechaEmisionCertificado'];
    }

    get fechaCaducidadCertificadoField() {
        return this.formulario.controls['fechaCaducidadCertificado'];
    }

    get totalUnidadesField() {
        return this.formulario.controls['totalUnidades'];
    }

    get totalAsientosField() {
        return this.formulario.controls['totalAsientos'];
    }

    get transporteTerrestresField() {
        return this.formulario.controls['transporteTerrestres'];
    }

    get placaField() {
        return this.formularioTransporteTerrestre.controls['placa'];
    }

    get matriculaField() {
        return this.formularioTransporteTerrestre.controls['matricula'];
    }

    get fechaMatriculaField() {
        return this.formularioTransporteTerrestre.controls['fechaMatricula'];
    }

    get fechaCaducidadMatriculaField() {
        return this.formularioTransporteTerrestre.controls['fechaCaducidadMatricula'];
    }

    get capacidadField() {
        return this.formularioTransporteTerrestre.controls['capacidad'];
    }

    get tipoField() {
        return this.formularioTransporteTerrestre.controls['tipo'];
    }

    protected readonly ClasificacionCodigoEnum = ClasificacionCodigoEnum;
    protected readonly TramiteTransporteTipoAerolineasEnum = TramiteTransporteTipoAerolineasEnum;
    protected readonly TramiteTransporteTipoLocalesEnum = TramiteTransporteTipoLocalesEnum;
}
