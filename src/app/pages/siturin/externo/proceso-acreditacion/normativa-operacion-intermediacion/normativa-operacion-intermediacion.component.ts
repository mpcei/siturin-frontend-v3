import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {Router} from '@angular/router';
import {environment} from "@env/environment";
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { Panel } from 'primeng/panel';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { Ripple } from 'primeng/ripple';
import { MultiSelect } from 'primeng/multiselect';
import { NormativaModalidadTurismoAventuraComponent } from '../../../compartido/normativa-modalidad-turismo-aventura/normativa-modalidad-turismo-aventura.component';
import { NormativaComponent } from '../../../compartido/normativa/normativa.component';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { KeyFilter } from 'primeng/keyfilter';
import { DatosSriComponent } from '../../../compartido/datos-sri/datos-sri.component';
import { ProgressBarComponent } from '../../../../../legacy/shared/components/progress-bar/progress-bar.component';

import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { CatalogoModel, CompaniaTransporteTuristicoModel, EstablecimientoModel, GuiaTurismoModel, ModalidadTurismoAventuraModel, RepresentanteVentaModel, TramiteModel } from '@/legacy/models/siturin';
import { ColumnModel } from '@/legacy/models/core';
import { ApiRestInternosHttpService, CatalogosSiturinService, CatastrosHttpService, CategoriasHttpService, ClasificacionesHttpService, DinardapHttpService, EstablecimientosService, TramitesHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { CatalogoSiturinTipoEnum, TramiteTiposEnum } from '@/legacy/shared/enums';
@Component({
    selector: 'app-normativa-operacion-intermediacion',
    templateUrl: './normativa-operacion-intermediacion.component.html',
    styleUrls: ['./normativa-operacion-intermediacion.component.scss'],
    imports: [Bind, Divider, Panel, ReactiveFormsModule, LabelDirective, ErrorMessageDirective, ToggleSwitch, NgIf, TableModule, PrimeTemplate, ButtonDirective, NgFor, Tag, Ripple, MultiSelect, NormativaModalidadTurismoAventuraComponent, NormativaComponent, Dialog, InputText, KeyFilter, DatosSriComponent, ProgressBarComponent, AsyncPipe, InputNumber, Select]
})
export class NormativaOperacionIntermediacionComponent implements OnInit {
  @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();
  @Input() actividad: AbstractControl = new FormControl();
  @Input() clasificacion: AbstractControl = new FormControl();
  @Input() categoria: AbstractControl = new FormControl();

  private catastrosHttpService=inject( CatastrosHttpService);
    private formBuilder=inject( UntypedFormBuilder);
    private catalogosSiturinService=inject( CatalogosSiturinService);
    private categoriasHttpService=inject( CategoriasHttpService);
    private clasificacionesHttpService=inject( ClasificacionesHttpService);
    private coreService=inject( CoreService);
    private dinardapHttpService=inject( DinardapHttpService);
    private apiRestInternosHttpService=inject( ApiRestInternosHttpService);
    private establecimientosService=inject( EstablecimientosService);
    public messageService=inject( MessageService);
    private tramitesHttpService=inject( TramitesHttpService);
    private router=inject( Router);

  cargado$ = this.coreService.loaded$;
  establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
  columnasCompaniasTransporteTuristicoTabla: ColumnModel[] = this.configurarColumnasCompaniasTransporteTuristicoTabla();
  columnasGuiasTurismoTabla: ColumnModel[] = this.configurarColumnasGuiasTurismoTabla();
  columnasRepresentantesVentasTabla: ColumnModel[] = this.configurarColumnasRepresentantesVentasTabla();
  formulario: FormGroup = this.nuevoFormulario;
  formularioCompaniaTransporteTuristico: FormGroup = this.nuevoFormularioCompaniaTransporteTuristico;
  formularioGuiaTurismo: FormGroup = this.nuevoFormularioGuiaTurismo;
  formularioRepresentanteVentas: FormGroup = this.nuevoFormularioRepresentanteVentas;
  modalidadesTurismoAventura: ModalidadTurismoAventuraModel[] = [];
  modalidadesTurismoAventuraAgua: CatalogoModel[] = [];
  modalidadesTurismoAventuraAire: CatalogoModel[] = [];
  modalidadesTurismoAventuraTierra: CatalogoModel[] = [];
  dialogoNuevoCompaniasTransporteTuristico: boolean = false;
  dialogoNuevoGuiasTurismo: boolean = false;
  dialogoNuevoRepresentantesVentas: boolean = false;
  formularioValido: boolean = false;
  normativaRespuestas: any[] = [];
  normativaRespuestasModalidadesTurismoAventura: any[] = [];
  indexCompaniasTransporteTuristico: number = -1;
  indexGuiasTurismo: number = -1;
  indexRepresentantesVentas: number = -1;
  dialogoCrearTramite: boolean = false;
  camposInvalidos: string[] = [];
  espacioFisicoPermanentes: CatalogoModel[] = [];
  totalTrabajadores: number = 0;

  constructor(

  ) {
    this.esAreaProtegidaField.valueChanges.subscribe(value => {
      if (value) {
        this.contratoAreaProtegidaField.setValidators(Validators.requiredTrue);
      } else {
        this.contratoAreaProtegidaField.clearValidators();
      }
      this.contratoAreaProtegidaField.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    if (this.establecimientoSeleccionado.tramiteActual) {
      this.establecimientoSeleccionado.tramiteActual.tramiteOperacionIntermediacion = {};
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

      if (this.establecimientoSeleccionado.tramiteActual.totalHombres) {
        this.totalTrabajadores = this.establecimientoSeleccionado.tramiteActual.totalHombres;
      }

      if (this.establecimientoSeleccionado.tramiteActual.totalMujeres) {
        this.totalTrabajadores = this.establecimientoSeleccionado.tramiteActual.totalMujeres;
      }

      if (this.establecimientoSeleccionado.tramiteActual.totalHombres && this.establecimientoSeleccionado.tramiteActual.totalMujeres) {
        this.totalTrabajadores = this.establecimientoSeleccionado.tramiteActual.totalHombres + this.establecimientoSeleccionado.tramiteActual.totalMujeres;
      }
    }

    this.formulario.valueChanges.subscribe(() => {
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    });

    this.obtenerEspacioFisicoPermanentes();

    this.tieneGuiasTurismoField.valueChanges.subscribe(value => {
      this.guiasTurismoField.clearValidators();

      if (value) {
        this.guiasTurismoField.setValidators(Validators.required);
      }

      if (this.establecimientoSeleccionado.tramiteActual) {
        this.establecimientoSeleccionado.tramiteActual.tieneGuiasTurismo = value;
        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
      }

      this.guiasTurismoField.updateValueAndValidity();
    });

    this.tieneCompaniasTransporteTuristicoField.valueChanges.subscribe(value => {
      this.companiasTransporteTuristicoField.clearValidators();

      if (value) {
        this.companiasTransporteTuristicoField.setValidators(Validators.required);
      }

      if (this.establecimientoSeleccionado.tramiteActual) {
        this.establecimientoSeleccionado.tramiteActual.tieneCompaniasTransporteTuristico = value;
        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
      }

      this.companiasTransporteTuristicoField.updateValueAndValidity();
    });

    this.tieneRepresentatesVentasField.valueChanges.subscribe(value => {
      this.representantesVentasField.clearValidators();

      if (value) {
        this.representantesVentasField.setValidators(Validators.required);
      }

      if (this.establecimientoSeleccionado.tramiteActual) {
        this.establecimientoSeleccionado.tramiteActual.tieneRepresentantesVentas = value;
        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
      }

      this.representantesVentasField.updateValueAndValidity();
    });

    this.tieneModalidadesTurismoAventuraField.valueChanges.subscribe(value => {
      this.modalidadesTurismoAventuraField.clearValidators();
      this.tieneModalidadAventuraOtraAgenciaField.reset();

      if (value) {
        this.modalidadesTurismoAventuraField.setValidators(Validators.required);
        this.obtenerModalidadesTurismoAventura();
      }
      this.modalidadesTurismoAventuraField.updateValueAndValidity();

      if (this.establecimientoSeleccionado.tramiteActual)
        this.establecimientoSeleccionado.tramiteActual.tieneModalidadesTurismoAventura = value;

      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    });

    this.tieneModalidadAventuraOtraAgenciaField.valueChanges.subscribe(value => {
      if (this.establecimientoSeleccionado.tramiteActual)
        this.establecimientoSeleccionado.tramiteActual.tieneModalidadAventuraOtraAgencia = value;

      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    });

    this.modalidadesTurismoAventuraAguaField.valueChanges.subscribe(value => {
      this.modalidadesTurismoAventura = [];
      this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(
        this.modalidadesTurismoAventuraAireField.value,
        this.modalidadesTurismoAventuraTierraField.value
      );

      if (this.establecimientoSeleccionado.tramiteActual)
        this.establecimientoSeleccionado.tramiteActual.modalidadesTurismoAventura = this.modalidadesTurismoAventura;

      this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

      this.validarFormulario();
    });

    this.modalidadesTurismoAventuraAireField.valueChanges.subscribe(value => {
      this.modalidadesTurismoAventura = [];
      this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(
        this.modalidadesTurismoAventuraAireField.value,
        this.modalidadesTurismoAventuraTierraField.value
      );

      if (this.establecimientoSeleccionado.tramiteActual)
        this.establecimientoSeleccionado.tramiteActual.modalidadesTurismoAventura = this.modalidadesTurismoAventura;

      this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

      this.validarFormulario();
    });

    this.modalidadesTurismoAventuraTierraField.valueChanges.subscribe(value => {
      this.modalidadesTurismoAventura = [];
      this.modalidadesTurismoAventura = this.modalidadesTurismoAventuraAguaField.value.concat(
        this.modalidadesTurismoAventuraAireField.value,
        this.modalidadesTurismoAventuraTierraField.value
      );

      if (this.establecimientoSeleccionado.tramiteActual)
        this.establecimientoSeleccionado.tramiteActual.modalidadesTurismoAventura = this.modalidadesTurismoAventura;

      this.modalidadesTurismoAventuraField.patchValue(this.modalidadesTurismoAventura);
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;

      this.validarFormulario();
    });

    this.cedulaGuiaTurismoField.valueChanges.subscribe(value => {
      if (value && value.length === 10) {
        this.apiRestInternosHttpService.obtenerGuia(value).subscribe(guia => {

          if (!guia?.apellidosNombres) {
            this.dinardapHttpService.obtenerRegistroCivil(value).subscribe(response => {
              this.nombresGuiaTurismoField.setValue(response.nombre);
              this.esGuiaTurismoField.setValue(false);
            });
          } else {
            this.nombresGuiaTurismoField.setValue(guia.apellidosNombres);
            this.esGuiaTurismoField.setValue(true);
          }
        });
      } else {
        this.nombresGuiaTurismoField.setValue(null);
        this.esGuiaTurismoField.setValue(false);
      }
      this.formularioGuiaTurismo.updateValueAndValidity();
    });

    this.esAreaProtegidaField.valueChanges.subscribe(value => {
      if (value && this.establecimientoSeleccionado.tramiteActual) {
        this.establecimientoSeleccionado.tramiteActual.esAreaProtegida = this.esAreaProtegidaField.value;
      }

      this.validarFormulario();
    });

    this.contratoAreaProtegidaField.valueChanges.subscribe(value => {
      if (value && this.establecimientoSeleccionado.tramiteActual) {
        this.establecimientoSeleccionado.tramiteActual.contratoAreaProtegida = this.contratoAreaProtegidaField.value;
      }

      this.validarFormulario();
    });

    this.personalAcreditadoIdiomaField.valueChanges.subscribe(value => {
      if (value && this.establecimientoSeleccionado.tramiteActual?.tramiteOperacionIntermediacion) {
        this.establecimientoSeleccionado.tramiteActual.tramiteOperacionIntermediacion = {
          espacioFisicoPermanente: this.espacioFisicoPermanenteField.value,
          personalAcreditadoIdioma: this.personalAcreditadoIdiomaField.value
        };
      }

      this.validarFormulario();
    });

    this.espacioFisicoPermanenteField.valueChanges.subscribe(value => {
      if (value && this.establecimientoSeleccionado.tramiteActual?.tramiteOperacionIntermediacion) {
        this.establecimientoSeleccionado.tramiteActual.tramiteOperacionIntermediacion = {
          personalAcreditadoIdioma: this.personalAcreditadoIdiomaField.value,
          espacioFisicoPermanente: this.espacioFisicoPermanenteField.value
        };
      }

      this.validarFormulario();
    });

    // this.numeroRucCompaniaTransporteTuristicoField.valueChanges.subscribe(value => {
    //   if (value && value.length === 13) {
    //     this.dinardapHttpService.obtenerRuc(value).subscribe(response => {
    //       this.razonSocialCompaniaTransporteTuristicoField.setValue(response.razonSocial);
    //     });
    //   } else {
    //     this.razonSocialCompaniaTransporteTuristicoField.setValue(null);
    //   }
    // });
  }

  configurarColumnasRepresentantesVentasTabla(): ColumnModel[] {
    return [
      {field: 'ruc', header: 'RUC'},
      {field: 'razonSocial', header: 'Razón Social'},
      {field: 'tieneTituloProfesional', header: 'Título Profesional'},
      {field: 'tieneContrato', header: 'Contrato Suscrito'},
      {field: 'tieneExperenciaLaboral', header: 'Experiencia Probada'},
    ]
  }

  configurarColumnasGuiasTurismoTabla(): ColumnModel[] {
    return [
      {field: 'cedula', header: 'Identificación'},
      {field: 'nombres', header: 'Nombres Completo'},
      // {field: 'esGuia', header: 'Es Guía'},
    ]
  }

  configurarColumnasCompaniasTransporteTuristicoTabla(): ColumnModel[] {
    return [
      {field: 'ruc', header: 'RUC'},
      {field: 'razonSocial', header: 'Razón Social'},
      {field: 'tipoContribuyente', header: 'Tipo Contribuyente'},
    ]
  }

  get nuevoFormulario() {
    return this.formBuilder.group({
      normativaRespuestas: [[]],
      normativaRespuestasModalidadesTurismoAventura: [[]],
      tieneCompaniasTransporteTuristico: [false],
      tieneGuiasTurismo: [false],
      tieneRepresentantesVentas: [false],
      tieneModalidadesTurismoAventura: [false],
      companiasTransporteTuristico: [[]],
      guiasTurismo: [[]],
      representantesVentas: [[]],
      modalidadesTurismoAventura: [[]],
      modalidadesTurismoAventuraAgua: [[]],
      modalidadesTurismoAventuraAire: [[]],
      modalidadesTurismoAventuraTierra: [[]],
      esAreaProtegida: [false],
      contratoAreaProtegida: [false],
      tipoLocal: [null],
      personalAcreditadoIdioma: [null, [Validators.required]],
      espacioFisicoPermanente: [null, [Validators.required]],
      tieneModalidadAventuraOtraAgencia: [null],
    });
  }

  get nuevoFormularioCompaniaTransporteTuristico() {
    return this.formBuilder.group(
      {
        ruc: [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
        razonSocial: [null, [Validators.required]],
        tipoContribuyente: [null, [Validators.required]],
      }
    );
  }

  get nuevoFormularioGuiaTurismo() {
    return this.formBuilder.group(
      {
        cedula: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        nombres: [{value: null, disable: true}, [Validators.required]],
        esGuia: [false],
        fechaNacimiento: [null],
        fechaExpedicion: [null],
        fechaExpiracion: [null],
        nacionalidad: [null],
      }
    );
  }

  get nuevoFormularioRepresentanteVentas() {
    return this.formBuilder.group(
      {
        ruc: [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
        razonSocial: [null, [Validators.required]],
        tieneTituloProfesional: [false, [Validators.requiredTrue]],
        tieneContrato: [false, [Validators.requiredTrue]],
        tieneExperenciaLaboral: [false, [Validators.requiredTrue]],
        tipoContribuyente: [null, [Validators.required]],
      }
    );
  }

  guardarTramite() {
    if (this.validarFormulario()) {
      this.messageService.questionCustom(`¿Está seguro de gestionar el trámite “${this.establecimientoSeleccionado.tramiteActual?.tipo?.nombre}” ante el ${environment.MINISTERIO}?`,
        `Recuerde que, una vez enviada la información, esta será verificada mediante inspección.”`, 'Si, Gestionar')
        .then((result) => {
          if (result.isConfirmed) {
            this.dialogoCrearTramite = true;
            this.tramitesHttpService.guardarTramiteOperacionIntermediacionContinente(this.establecimientosService.establecimiento)
              .subscribe(tramiteActual => {
                this.dialogoCrearTramite = false;
                this.descargarDocumento(tramiteActual);
                this.router.navigate(['/siturin/externo/establecimientos']);
              }, error => this.dialogoCrearTramite = false);
          }
        });
    } else {
      this.formulario.markAllAsTouched();
      this.messageService.getErrorsCustom('Por favor complete toda la información', '');
    }
  }

  agregarCompaniaTransporteTuristico() {
    if (this.formularioCompaniaTransporteTuristico.valid) {
      const companias: any[] = this.companiasTransporteTuristicoField.value;

      if (companias.find(compania => compania.ruc === this.numeroRucCompaniaTransporteTuristicoField.value)) {
        this.dialogoNuevoCompaniasTransporteTuristico = false;
        this.messageService.getInfoCustom('La compañía ya existe', 'Los datos han sido actualizados');
        return;
      }

      if (this.indexCompaniasTransporteTuristico > -1) {
        this.companiasTransporteTuristicoField.value[this.indexCompaniasTransporteTuristico]
          = this.formularioCompaniaTransporteTuristico.value;
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

  agregarGuiaTurismo() {
    if (this.formularioGuiaTurismo.valid) {
      const guias: any[] = this.guiasTurismoField.value;

      if (guias.find(guia => guia.cedula === this.cedulaGuiaTurismoField.value)) {
        this.dialogoNuevoGuiasTurismo = false;
        this.messageService.getInfoCustom('El guía ya existe', 'Los datos han sido actualizados');
        return;
      }

      if (this.indexGuiasTurismo > -1) {
        this.guiasTurismoField.value[this.indexGuiasTurismo]
          = this.formularioGuiaTurismo.value;
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

  agregarRepresentanteVenta() {
    if (this.formularioRepresentanteVentas.valid) {
      const representantesVentas: any[] = this.representantesVentasField.value;

      if (representantesVentas.find(representanteVentas => {
        return representanteVentas.ruc === this.numeroRucRepresentanteVentasField.value;
      })) {
        this.dialogoNuevoRepresentantesVentas = false;
        this.messageService.getInfoCustom('El representante de ventas ya existe', 'Los datos han sido actualizados');
        return;
      }
      if (this.indexRepresentantesVentas > -1) {
        this.representantesVentasField.value[this.indexRepresentantesVentas]
          = this.formularioRepresentanteVentas.value;
      } else {
        this.representantesVentasField.value.push(this.formularioRepresentanteVentas.value);
      }

      if (this.establecimientoSeleccionado.tramiteActual) {
        this.establecimientoSeleccionado.tramiteActual.representantesVentas = this.representantesVentasField.value;
        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
      }

      this.representantesVentasField.updateValueAndValidity();
      this.dialogoNuevoRepresentantesVentas = false;
    } else {
      this.formularioRepresentanteVentas.markAllAsTouched();
    }
  }

  descargarDocumento(tramiteActual: TramiteModel) {
    const catastro = tramiteActual.catastro;
    if (catastro && tramiteActual) {
      this.catastrosHttpService.obtenerDocumentoUsuarioExterno(catastro.id!, tramiteActual.tipo?.codigo!)
        .subscribe(documento => {
          this.coreService.descargarDocumentoPDF(documento, tramiteActual.tipo?.codigo + '_' + catastro.numeroRegistro);
        });

      this.catastrosHttpService.obtenerDocumentoUsuarioExterno(catastro.id!, 'check_list_externo')
        .subscribe(documento => {
          this.coreService.descargarDocumentoPDF(documento,  'check_list_' + catastro.numeroRegistro);
        });
    }
  }

  editarCompaniaTransporteTuristico(companiaTransporteTuristico: CompaniaTransporteTuristicoModel, index: number) {
    this.dialogoNuevoCompaniasTransporteTuristico = true;
    this.indexCompaniasTransporteTuristico = index;
    this.formularioCompaniaTransporteTuristico.patchValue(companiaTransporteTuristico);
    this.numeroRucCompaniaTransporteTuristicoField.patchValue(companiaTransporteTuristico.ruc);
  }

  editarGuiaTurismo(guiaTurismo: GuiaTurismoModel, index: number) {
    this.dialogoNuevoGuiasTurismo = true;
    this.indexGuiasTurismo = index;
    this.formularioGuiaTurismo.patchValue(guiaTurismo);
  }

  editarRepresentanteVenta(representanteVenta: RepresentanteVentaModel, index: number) {
    this.dialogoNuevoRepresentantesVentas = true;
    this.indexRepresentantesVentas = index;
    this.formularioRepresentanteVentas.patchValue(representanteVenta);
  }

  eliminarCompaniaTransporteTuristico(index: number) {
    this.companiasTransporteTuristicoField.value.splice(index, 1);

    if (this.establecimientoSeleccionado.tramiteActual) {
      this.establecimientoSeleccionado.tramiteActual.companiasTransporteTuristico = this.companiasTransporteTuristicoField.value;
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    }
  }

  eliminarGuiaTurismo(index: number) {
    this.guiasTurismoField.value.splice(index, 1);

    if (this.establecimientoSeleccionado.tramiteActual) {
      this.establecimientoSeleccionado.tramiteActual.guiasTurismo = this.guiasTurismoField.value;
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    }
  }

  eliminarRepresentanteVenta(index: number) {
    this.representantesVentasField.value.splice(index, 1);

    if (this.establecimientoSeleccionado.tramiteActual) {
      this.establecimientoSeleccionado.tramiteActual.representantesVentas = this.representantesVentasField.value;
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    }
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

  llenarNormativaRespuestasModalidadesTurismoAventura(normativaRespuestas: any[]) {
    this.normativaRespuestasModalidadesTurismoAventura = normativaRespuestas;
    if (this.establecimientoSeleccionado.tramiteActual) {
      this.normativaRespuestasModalidadesTurismoAventuraField.setValue(normativaRespuestas);
      this.establecimientoSeleccionado.tramiteActual.normativaRespuestasModalidadesTurismoAventura = normativaRespuestas;
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    }

    this.validarFormulario();
  }

  obtenerModalidadesTurismoAventura() {
    const catalogos: CatalogoModel[] = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.MODALIDADES_AVENTURA_TURISMO)

    catalogos.forEach(catalogo => {
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

  mostrarDialogoNuevoCompaniasTransporteTuristico() {
    this.dialogoNuevoCompaniasTransporteTuristico = true;
    this.numeroRucCompaniaTransporteTuristicoField.reset();
    this.indexCompaniasTransporteTuristico = -1;
    this.formularioCompaniaTransporteTuristico.reset()
  }

  mostrarDialogoNuevoGuiasTurismo() {
    this.dialogoNuevoGuiasTurismo = true;
    this.indexGuiasTurismo = -1;
    this.formularioGuiaTurismo.reset()
  }

  mostrarDialogoNuevoRepresentantesVentas() {
    this.dialogoNuevoRepresentantesVentas = true;
    this.numeroRucCompaniaTransporteTuristicoField.reset();
    this.indexRepresentantesVentas = -1;
    this.formularioRepresentanteVentas.reset()
  }

  llenarCompaniaTransporteTuristico(companiaTransporteTuristico: CompaniaTransporteTuristicoModel) {
    this.razonSocialCompaniaTransporteTuristicoField.setValue(companiaTransporteTuristico.razonSocial);
    this.tipoContribuyenteCompaniaTransporteTuristicoField.setValue(companiaTransporteTuristico.tipoContribuyente);
  }

  llenarRepresentanteVenta(representanteVenta: RepresentanteVentaModel) {
    this.tipoContribuyenteRepresentanteVentaField.setValue(representanteVenta.tipoContribuyente);
    this.razonSocialRepresentanteVentaField.setValue(representanteVenta.razonSocial);
  }

  validarFormulario(): boolean {
    this.camposInvalidos = [];

    if (!this.formulario.valid) {
      if (this.tieneGuiasTurismoField.value && this.guiasTurismoField.value?.length === 0) {
        this.camposInvalidos.push('Guias de Turismo');
      }

      if (this.tieneCompaniasTransporteTuristicoField.value && this.companiasTransporteTuristicoField.value?.length === 0) {
        this.camposInvalidos.push('Compañías Transporte Turístico');
      }

      if (this.tieneRepresentatesVentasField.value && this.representantesVentasField.value?.length === 0) {
        this.camposInvalidos.push('Representantes Ventas');
      }

      if (this.tieneModalidadesTurismoAventuraField.value && this.modalidadesTurismoAventuraField.value?.length === 0) {
        this.camposInvalidos.push('Modalidades Turismo Aventura');
      }

      if (this.espacioFisicoPermanenteField.invalid) {
        this.camposInvalidos.push('Espacio Físico Permanente');
      }
    }

    if (Math.round(this.personalAcreditadoIdiomaField.value / this.totalTrabajadores * 100) < 20) {
      this.camposInvalidos.push(`El ${Math.round(this.personalAcreditadoIdiomaField.value / this.totalTrabajadores * 100)}%
      de empleados es inferior al 20% requerido, de acuerdo a lo detallado en el artículo 12
      del Acuerdo ministerial Nro. 007-2024`);
    }

    if (this.normativaRespuestas.length === 0
      && this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo != TramiteTiposEnum.ACTUALIZACION) {
      this.camposInvalidos.push('Normativa');
    }

    if (this.tieneModalidadesTurismoAventuraField.value && this.normativaRespuestasModalidadesTurismoAventura.length === 0) {
      this.camposInvalidos.push('Normativa Modalidades Turismo Aventura');
    }

    return this.camposInvalidos.length === 0 && this.formulario.valid;
  }

  obtenerEspacioFisicoPermanentes() {
    this.espacioFisicoPermanentes = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.OPERACION_INTERMEDIACION_ESPACIO_FISICO_PERMANENTE);
  }

  get modalidadesTurismoAventuraField() {
    return this.formulario.controls['modalidadesTurismoAventura'];
  }

  get tieneModalidadAventuraOtraAgenciaField() {
    return this.formulario.controls['tieneModalidadAventuraOtraAgencia'];
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

  get companiasTransporteTuristicoField() {
    return this.formulario.controls['companiasTransporteTuristico'];
  }

  get guiasTurismoField() {
    return this.formulario.controls['guiasTurismo'];
  }

  get representantesVentasField() {
    return this.formulario.controls['representantesVentas'];
  }

  get tieneRepresentatesVentasField() {
    return this.formulario.controls['tieneRepresentantesVentas'];
  }

  get tieneGuiasTurismoField() {
    return this.formulario.controls['tieneGuiasTurismo'];
  }

  get tieneCompaniasTransporteTuristicoField() {
    return this.formulario.controls['tieneCompaniasTransporteTuristico'];
  }

  get tieneModalidadesTurismoAventuraField() {
    return this.formulario.controls['tieneModalidadesTurismoAventura'];
  }

  get numeroRucRepresentanteVentasField() {
    return this.formularioRepresentanteVentas.controls['ruc'];
  }

  get tieneTituloProfesionalRepresentanteVentasField() {
    return this.formularioRepresentanteVentas.controls['tieneTituloProfesional'];
  }

  get tieneContratoRepresentanteVentasField() {
    return this.formularioRepresentanteVentas.controls['tieneContrato'];
  }

  get tieneExperenciaLaboralRepresentanteVentasField() {
    return this.formularioRepresentanteVentas.controls['tieneExperenciaLaboral'];
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

  get numeroRucCompaniaTransporteTuristicoField() {
    return this.formularioCompaniaTransporteTuristico.controls['ruc'];
  }

  get razonSocialCompaniaTransporteTuristicoField() {
    return this.formularioCompaniaTransporteTuristico.controls['razonSocial'];
  }

  get tipoContribuyenteCompaniaTransporteTuristicoField() {
    return this.formularioCompaniaTransporteTuristico.controls['tipoContribuyente'];
  }

  get razonSocialRepresentanteVentaField() {
    return this.formularioRepresentanteVentas.controls['razonSocial'];
  }

  get tipoContribuyenteRepresentanteVentaField() {
    return this.formularioRepresentanteVentas.controls['tipoContribuyente'];
  }

  get normativaRespuestasField() {
    return this.formulario.controls['normativaRespuestas'];
  }

  get normativaRespuestasModalidadesTurismoAventuraField() {
    return this.formulario.controls['normativaRespuestasModalidadesTurismoAventura'];
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

  get personalAcreditadoIdiomaField() {
    return this.formulario.controls['personalAcreditadoIdioma'];
  }

  get espacioFisicoPermanenteField() {
    return this.formulario.controls['espacioFisicoPermanente'];
  }

  protected readonly Math = Math;
  protected readonly environment = environment;
}
