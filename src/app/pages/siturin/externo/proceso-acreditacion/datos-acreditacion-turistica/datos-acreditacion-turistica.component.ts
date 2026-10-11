import {ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { NgIf } from '@angular/common';
import { SkeletonComponent } from '../../../../../legacy/shared/components/skeleton/skeleton.component';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { CtcComponent } from '../ctc/ctc.component';
import { CtcActualizacionComponent } from '../ctc/ctc-actualizacion/ctc-actualizacion.component';
import { CtcNuevaActividadComponent } from '../ctc/ctc-nueva-actividad/ctc-nueva-actividad.component';
import { TransporteRegistroComponent } from '../transporte/transporte-registro/transporte-registro.component';
import { NormativaParqueComponent } from '../normativa-parque/normativa-parque.component';
import { NormativaEventoComponent } from '../normativa-evento/normativa-evento.component';

import { Select } from 'primeng/select';
import { ActividadModel, CatalogoModel, CategoriaModel, ClasificacionModel, EstablecimientoModel } from '@/legacy/models/siturin';
import { AuthHttpService } from '@/legacy/services/auth';
import { BreadcrumbService } from '@/layout/service';
import { ActividadesHttpService, CatalogosSiturinService, CategoriasHttpService, ClasificacionesHttpService, EstablecimientosHttpService, EstablecimientosService, NormativasService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { ActividadCodigoEnum, CatalogoSiturinTipoEnum, CatastroEstadoEnum, ClasificacionCodigoEnum, DpaCodigoEnum, NormativaTypeEnum, PersoneriaJuridicaCodigoEnum, RucTipoContribuyenteEnum, TramiteTiposEnum, ZonaGeograficaCodigoEnum } from '@/legacy/shared/enums';
import { NormativaAlimentosBebidasComponent } from '../normativa-alimentos-bebidas/normativa-alimentos-bebidas.component';
import { NormativaAlojamientoComponent } from '../normativa-alojamiento/normativa-alojamiento.component';
import { InmueblesHabitacionalesComponent } from '../alojamiento/inmuebles-habitacionales/inmuebles-habitacionales.component';
import { NormativaAlojamientoGalapagosComponent } from '../normativa-alojamiento-galapagos/normativa-alojamiento-galapagos.component';
import { NormativaOperacionIntermediacionComponent } from '../normativa-operacion-intermediacion/normativa-operacion-intermediacion.component';
@Component({
    selector: 'app-datos-acreditacion-turistica',
    templateUrl: './datos-acreditacion-turistica.component.html',
    styleUrls: ['./datos-acreditacion-turistica.component.scss'],
    imports: [NgIf, SkeletonComponent, Bind, Card, Divider, ReactiveFormsModule, LabelDirective, ErrorMessageDirective, ToggleSwitch, NormativaAlimentosBebidasComponent, NormativaAlojamientoComponent, InmueblesHabitacionalesComponent, NormativaAlojamientoGalapagosComponent, NormativaOperacionIntermediacionComponent, CtcComponent, CtcActualizacionComponent, CtcNuevaActividadComponent, TransporteRegistroComponent, NormativaParqueComponent, NormativaEventoComponent, Select]
})
export class DatosAcreditacionTuristicaComponent implements OnInit {
  @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();

   private authHttpService=inject( AuthHttpService);
    private activatedRoute=inject( ActivatedRoute);
    private breadcrumbService=inject( BreadcrumbService);
    private catalogosSiturinService=inject( CatalogosSiturinService);
    private changeDetectorRef=inject( ChangeDetectorRef);
    private actividadesHttpService=inject( ActividadesHttpService);
    private clasificacionesHttpService=inject( ClasificacionesHttpService);
    private categoriasHttpService=inject( CategoriasHttpService);
    private coreService=inject( CoreService);
    private establecimientosService=inject( EstablecimientosService);
    private establecimientosHttpService=inject( EstablecimientosHttpService);
    private formBuilder=inject( UntypedFormBuilder);
    private normativasService=inject( NormativasService);
    public messageService=inject( MessageService);

  establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
  id: string = '';
  formulario: UntypedFormGroup = this.nuevoFormulario;
  panelHeader: string = 'Seleccione la Actividad y/o Modalidad Turística; clasificación y categoría de ser el caso';
  isLoadingSkeleton: boolean = false;
  loaded$ = this.coreService.loaded$;
  personeriaJuridicas: CatalogoModel[] = [];
  zonasGeograficas: CatalogoModel[] = [];
  actividades: ActividadModel[] = [];
  actividadesClon: ActividadModel[] = [];
  clasificaciones: ClasificacionModel[] = [];
  categorias: CategoriaModel[] = [];
  tipoLocales: CatalogoModel[] = [];
  tipoLocalesClon: CatalogoModel[] = [];
  mostrarNormativa: boolean = false;
  flag = false;

  constructor(

  ) {

  }

  ngOnInit(): void {
    if (this.establecimientoSeleccionado.tramiteActual) {
      this.personeriaJuridicaField.patchValue(this.establecimientoSeleccionado.tramiteActual.personeriaJuridica);
      this.formulario.patchValue(this.establecimientoSeleccionado.tramiteActual);
    }

    this.formulario.valueChanges.subscribe(() => {
      this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
    });

    if (this.clasificacionField.value?.tieneNormativa) {
      this.cargarNormativaPorClasificacion();
    }

    if (this.categoriaField.value?.tieneNormativa) {
      this.cargarNormativaPorCategoria();
    }

    this.personeriaJuridicaField.valueChanges.subscribe(value => {
      this.actividades = [];
      this.clasificaciones = [];
      this.categorias = [];
    });

    this.zonaGeograficaField.valueChanges.subscribe(value => {
      if (value) {
        this.obtenerActividades(value.id);
        this.actividades = [];
        this.clasificaciones = [];
        this.categorias = [];
      }
    });

    this.actividadField.valueChanges.subscribe(value => {
      this.flag = false;
      setTimeout(() => {
        this.flag = true;
      }, 500);

      this.obtenerTipoLocales();

      if (this.establecimientoSeleccionado.tramiteActual && value) {
        this.establecimientoSeleccionado.tramiteActual.actividad = value;
      }

      this.formulario.updateValueAndValidity();

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REGISTRO) {
        this.clasificacionField.reset();
      }

      if (value?.id) {
        this.obtenerClasificaciones(value?.id);
      }

      this.clasificaciones = [];
      this.categorias = [];
      this.mostrarNormativa = false;

      // if (value && value?.codigo.search('operacion_intermediacion') === -1) {
      this.tipoLocales = this.tipoLocalesClon.filter(tipoLocal => tipoLocal.codigo != 'espacio_compartido');
      // } else {
      //   this.tipoLocales = this.tipoLocalesClon;
      // }

      // this.tipoLocalField.reset();
      this.changeDetectorRef.detectChanges();
    });

    this.clasificacionField.valueChanges.subscribe(value => {
      this.flag = false;
      setTimeout(() => {
        this.flag = true;
      }, 500);

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REGISTRO ||
        this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION ||
        this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION
      )
        this.categoriaField.reset();

      if (value?.id)
        this.obtenerCategorias(value.id);

      // this.tipoLocalField.reset();
      this.mostrarNormativa = false;

      if (value && value.tieneNormativa) {
        this.mostrarNormativa = true;
        this.categoriaField.disable();
      } else {
        this.mostrarNormativa = false;
        this.categoriaField.enable();
      }

      if (value && this.actividadField.value?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE
        ||
        this.actividadField.value?.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS
      ) {
        this.categoriaField.disable();
        this.mostrarNormativa = true;
      }

      if (this.establecimientoSeleccionado.tramiteActual && value)
        this.establecimientoSeleccionado.tramiteActual.clasificacion = value;

      this.formulario.updateValueAndValidity();
    });

    this.categoriaField.valueChanges.subscribe(value => {
      this.flag = false;
      setTimeout(() => {
        this.flag = true;
      }, 500);
      // this.mostrarNormativa = false;
      if (value && value.tieneNormativa) {
        this.mostrarNormativa = true;
      }

      if (this.establecimientoSeleccionado.tramiteActual && value)
        this.establecimientoSeleccionado.tramiteActual.categoria = value;

      // this.tipoLocalField.reset();
      this.formulario.updateValueAndValidity();
    });

    this.tipoLocalField.valueChanges.subscribe(value => {
      if (this.establecimientoSeleccionado.tramiteActual && value)
        this.establecimientoSeleccionado.tramiteActual.tipoLocal = value;

      this.formulario.updateValueAndValidity();
    });

    if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.ACTUALIZACION) {
      this.actividadField.disable();
      this.clasificacionField.disable();
      this.categoriaField.disable();
    }

    if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION) {
      this.actividadField.disable();
    }

    if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION) {
      this.actividadField.disable();
      this.clasificacionField.disable();
    }

    this.obtenerPersoneriaJuridicas();
    this.obtenerZonasGeograficas();
  }

  get nuevoFormulario(): UntypedFormGroup {
    return this.formBuilder.group({
      personeriaJuridica: [null, [Validators.required]],
      zonaGeografica: [{value: null, disabled: true}, [Validators.required]],
      actividad: [null, [Validators.required]],
      clasificacion: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      tipoLocal: [null, [Validators.required]],
      usoSuelos: [false, [Validators.requiredTrue]]
    });
  }

  cargarNormativaPorClasificacion() {
    if (this.clasificacionField.value.tieneNormativa)
      this.normativasService.setModelo(this.clasificacionField.value.id, NormativaTypeEnum.CLASIFICACION);
  }

  cargarNormativaPorCategoria() {
    if (this.categoriaField.value.tieneNormativa)
      this.normativasService.setModelo(this.categoriaField.value.id, NormativaTypeEnum.CATEGORIA);
  }

  obtenerPersoneriaJuridicas() {
    this.personeriaJuridicas = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.RUC_TIPOS_CONTRIBUYENTES);
  }

  obtenerZonasGeograficas() {
    this.zonasGeograficas = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.ZONAS_GEOGRAFICAS);
    this.validarZonaGeograficaEstablecimiento();

  }

  obtenerActividades(zonaGeograficaId: number) {
    this.actividadesHttpService.obtenerActividadesPorZonaGeografica(zonaGeograficaId).subscribe((actividades) => {
      this.actividades = actividades;
      if (this.establecimientoSeleccionado.tramiteActual?.actividad) {
        this.actividadField.patchValue(this.establecimientoSeleccionado.tramiteActual?.actividad);
      }

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION) {
        this.actividades = this.actividades.filter(actividad =>
          actividad.id == this.establecimientosService.establecimiento?.tramiteActual?.actividad?.id
          && (actividad.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE
            || actividad.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS)
        );
        return;
      }

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.NUEVA_ACTIVIDAD
        && this.establecimientoSeleccionado.tramiteActual?.actividad?.codigo?.includes('ctc')) {
        this.actividades = this.actividades.filter(actividad =>
          (actividad.codigo == ActividadCodigoEnum.CTC_CONTINENTE
            || actividad.codigo == ActividadCodigoEnum.CTC_GALAPAGOS)
        );
        return;
      }

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.NUEVA_ACTIVIDAD
        && (this.establecimientoSeleccionado.tramiteActual?.actividad?.codigo?.includes('parques')
          || this.establecimientoSeleccionado.tramiteActual?.actividad?.codigo?.includes('eventos'))) {
        this.actividades = this.actividades.filter(actividad =>
          (actividad.codigo == ActividadCodigoEnum.PARQUES_CONTINENTE
            || actividad.codigo == ActividadCodigoEnum.PARQUES_GALAPAGOS
            || actividad.codigo == ActividadCodigoEnum.EVENTOS_CONTINENTE
            || actividad.codigo == ActividadCodigoEnum.EVENTOS_GALAPAGOS)
        );
        return;
      }

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION
      ) {
        this.actividades = this.actividades.filter(actividad =>
          actividad.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.ALOJAMIENTO_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.PARQUES_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.PARQUES_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.EVENTOS_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.EVENTOS_GALAPAGOS
        );
        return;
      }

      if (this.personeriaJuridicaField.value?.codigo === PersoneriaJuridicaCodigoEnum.CTC) {
        this.actividades = this.actividades.filter(actividad =>
          actividad.codigo == ActividadCodigoEnum.CTC_CONTINENTE || actividad.codigo == ActividadCodigoEnum.CTC_GALAPAGOS
        );
        return;
      }

      if (this.personeriaJuridicaField.value?.codigo === PersoneriaJuridicaCodigoEnum.FIDUCIARIA
        || this.personeriaJuridicaField.value?.codigo === PersoneriaJuridicaCodigoEnum.SOCIEDADES_CIVILES
        || this.personeriaJuridicaField.value?.codigo === PersoneriaJuridicaCodigoEnum.SEPS
        || this.establecimientoSeleccionado.ruc?.tipoContribuyente?.codigo === RucTipoContribuyenteEnum.NATURAL
      ) {
        this.actividades = this.actividades.filter(actividad =>
          actividad.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.ALOJAMIENTO_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.TRANSPORTE_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.TRANSPORTE_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.PARQUES_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.PARQUES_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.EVENTOS_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.EVENTOS_GALAPAGOS
        );
        return;
      }

      //Valida que no haya seleccionado ninguna de las personerias juridicas mencionadas
      if (!(this.personeriaJuridicaField.value?.codigo === PersoneriaJuridicaCodigoEnum.FIDUCIARIA
        || this.personeriaJuridicaField.value?.codigo === PersoneriaJuridicaCodigoEnum.SOCIEDADES_CIVILES
        || this.personeriaJuridicaField.value?.codigo === PersoneriaJuridicaCodigoEnum.SEPS
        || this.establecimientoSeleccionado.ruc?.tipoContribuyente?.codigo === RucTipoContribuyenteEnum.NATURAL
      )) {
        this.actividades = this.actividades.filter(actividad =>
          actividad.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.ALIMENTOS_BEBIDAS_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.ALOJAMIENTO_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.OPERACION_INTERMEDIACION_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.OPERACION_INTERMEDIACION_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.TRANSPORTE_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.TRANSPORTE_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.PARQUES_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.PARQUES_GALAPAGOS
          || actividad.codigo == ActividadCodigoEnum.EVENTOS_CONTINENTE
          || actividad.codigo == ActividadCodigoEnum.EVENTOS_GALAPAGOS
        );
        return;
      }
    });
  }

  obtenerClasificaciones(actividadId: number) {
    this.clasificacionesHttpService.obtenerClasificacionesPorActividad(actividadId).subscribe((clasificaciones) => {
      this.clasificaciones = clasificaciones;

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.NUEVA_CLASIFICACION
        || this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.NUEVA_ACTIVIDAD
        || this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REGISTRO) {
        this.clasificaciones = clasificaciones.filter(clasificacion => {
          let existeClasificacion = -1;
          this.clasificacionField.reset();

          if (this.establecimientoSeleccionado?.tramites) {
            // && tramite.catastro?.estado?.codigo != CatastroEstadoEnum.INACTIVO
            existeClasificacion =
              this.establecimientoSeleccionado.tramites.findIndex(tramite =>
                tramite.clasificacion?.codigo == clasificacion.codigo
                && tramite.catastro?.estado?.codigo != CatastroEstadoEnum.SUSPENSION_DEFINITIVA
              );
          }

          return existeClasificacion === -1;
        });

        if (this.clasificaciones.length === 1) {
          this.clasificacionField.patchValue(this.clasificaciones[0]);
        }

        return;
      }

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.REINGRESO) {
        this.clasificaciones = clasificaciones.filter(clasificacion => {
          let existeClasificacion = -1;
          if (this.establecimientoSeleccionado?.tramites) {
            existeClasificacion =
              this.establecimientoSeleccionado.tramites.findIndex(tramite =>
                tramite.clasificacion?.codigo == clasificacion.codigo
                && tramite.catastro?.estado?.codigo != CatastroEstadoEnum.INACTIVO
                && tramite.catastro?.estado?.codigo != CatastroEstadoEnum.SUSPENSION_DEFINITIVA
              );
          }

          return existeClasificacion === -1;
        });
      }

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.RECLASIFICACION) {
        this.clasificaciones = clasificaciones.filter(clasificacion => {
          let existeClasificacion = -1;

          if (this.establecimientoSeleccionado?.tramites) {
            // && tramite.catastro?.estado?.codigo != CatastroEstadoEnum.INACTIVO
            existeClasificacion =
              this.establecimientoSeleccionado.tramites.findIndex(tramite =>
                tramite.clasificacion?.codigo == clasificacion.codigo
                && tramite.catastro?.estado?.codigo != CatastroEstadoEnum.SUSPENSION_DEFINITIVA
              );
          }

          return existeClasificacion === -1;
        });

        this.clasificaciones = this.clasificaciones.filter(clasificacion => clasificacion.codigo != this.establecimientoSeleccionado?.tramiteActual?.clasificacion?.codigo);
        return;
      }

      //Transporte
      if (this.establecimientoSeleccionado.tramiteActual?.actividad?.codigo === ActividadCodigoEnum.TRANSPORTE_CONTINENTE
        && this.establecimientoSeleccionado.ruc?.tipoContribuyente?.codigo === RucTipoContribuyenteEnum.NATURAL) {
        this.clasificaciones = clasificaciones.filter(clasificacion => {
          return clasificacion.codigo === ClasificacionCodigoEnum.MARITIMO;
        });
      }

      if (this.establecimientoSeleccionado.ruc?.tipoContribuyente?.codigo === RucTipoContribuyenteEnum.JURIDICA) {
        if (this.establecimientoSeleccionado.tramiteActual?.actividad?.codigo === ActividadCodigoEnum.TRANSPORTE_GALAPAGOS) {
          this.clasificaciones = clasificaciones.filter(clasificacion => {
            return clasificacion.codigo === ClasificacionCodigoEnum.AEREO || clasificacion.codigo === ClasificacionCodigoEnum.TERRESTRE;
          });
        }
      }

      if ((this.establecimientoSeleccionado.tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_CONTINENTE
          || this.establecimientoSeleccionado.tramiteActual?.actividad?.codigo === ActividadCodigoEnum.OPERACION_INTERMEDIACION_GALAPAGOS) &&
        this.personeriaJuridicaField.value?.codigo === PersoneriaJuridicaCodigoEnum.SEPS) {
        this.clasificaciones = clasificaciones.filter(clasificacion =>
          clasificacion.codigo === ClasificacionCodigoEnum.OPERADOR_TURISTICO
        );
        return;
      }

      if (this.clasificaciones.length === 1) {
        this.clasificacionField.patchValue(this.clasificaciones[0]);
        if (this.establecimientoSeleccionado.tramiteActual)
          this.establecimientoSeleccionado.tramiteActual.clasificacion = this.clasificaciones[0];
      }

      if (this.establecimientoSeleccionado.tramiteActual?.clasificacion) {
        this.clasificacionField.patchValue(this.establecimientoSeleccionado.tramiteActual?.clasificacion);
      }

      if (this.clasificacionField.value?.tieneNormativa) {
        this.normativasService.setModelo(this.clasificacionField.value.id, NormativaTypeEnum.CLASIFICACION);
      }

      // if (this.personeriaJuridicaField.value?.codigo === PersoneriaJuridicaCodigoEnum.CNC) {
      //   this.actividades = this.actividades.filter(actividad =>
      //     actividad.codigo == ActividadCodigoEnum.ALOJAMIENTO_CONTINENTE || actividad.codigo == ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS
      //   );
      //   return;
      // }

      this.clasificaciones = this.clasificaciones.sort((a, b) => a.orden! - b.orden!)
    });
  }

  obtenerCategorias(clasificacionId: number) {
    this.categoriasHttpService.obtenerCategoriasPorClasificacion(clasificacionId).subscribe((categorias) => {
      this.categorias = categorias;

      if (this.actividadField.value?.codigo.indexOf('alimentos_bebidas') === -1 && categorias.length === 1) {
        this.categoriaField.setValue(categorias[0]);

        if (this.categoriaField.value.tieneNormativa) {
          this.normativasService.setModelo(this.categoriaField.value.id, NormativaTypeEnum.CATEGORIA);
        }

        if (this.establecimientoSeleccionado?.tramiteActual)
          this.establecimientoSeleccionado.tramiteActual.categoria = categorias[0];
      }

      if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === TramiteTiposEnum.RECATEGORIZACION) {
        this.categorias = categorias.filter(categoria => {
          let existeCategoria = -1;

          if (this.establecimientoSeleccionado?.tramites) {
            existeCategoria =
              this.establecimientoSeleccionado.tramites.findIndex(tramite =>
                tramite.categoria?.id == categoria.id
                && tramite.catastro?.estado?.codigo != CatastroEstadoEnum.INACTIVO
                && tramite.catastro?.estado?.codigo != CatastroEstadoEnum.SUSPENSION_DEFINITIVA
              );
          }

          return existeCategoria === -1;
        });
      }

      if (this.establecimientoSeleccionado.tramiteActual?.categoria)
        this.categoriaField.patchValue(this.establecimientoSeleccionado.tramiteActual?.categoria);

      this.categorias = this.categorias.sort((a, b) => a.orden! - b.orden!)
    });
  }

  obtenerTipoLocales() {
    this.tipoLocales = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TRAMITE_TIPOS_LOCALES);

    this.tipoLocalesClon = this.tipoLocales;

    if (this.establecimientoSeleccionado.tramiteActual?.tipoLocal) {
      this.tipoLocalField.patchValue(this.establecimientoSeleccionado.tramiteActual?.tipoLocal);
      return;
    }

    if (this.actividadField.value.codigo === ActividadCodigoEnum.ALIMENTOS_BEBIDAS_CONTINENTE) {
      this.tipoLocalField.patchValue(this.tipoLocales.find(item => item.codigo === 'opcional'));
      return;
    }
  }

  validarZonaGeograficaEstablecimiento() {
    if (this.establecimientoSeleccionado.provincia?.codigo === DpaCodigoEnum.GALAPAGOS) {
      this.zonaGeograficaField.setValue(this.zonasGeograficas.find(zonaGeografica => zonaGeografica.codigo === ZonaGeograficaCodigoEnum.GALAPAGOS));
    } else {
      this.zonaGeograficaField.setValue(this.zonasGeograficas.find(zonaGeografica => zonaGeografica.codigo === ZonaGeograficaCodigoEnum.CONTINENTE));
    }
  }

  get personeriaJuridicaField(): AbstractControl {
    return this.formulario.controls['personeriaJuridica'];
  }

  get zonaGeograficaField(): AbstractControl {
    return this.formulario.controls['zonaGeografica'];
  }

  get actividadField(): AbstractControl {
    return this.formulario.controls['actividad'];
  }

  get clasificacionField(): AbstractControl {
    return this.formulario.controls['clasificacion'];
  }

  get categoriaField() {
    return this.formulario.controls['categoria'];
  }

  get tipoLocalField(): AbstractControl {
    return this.formulario.controls['tipoLocal'];
  }
}
