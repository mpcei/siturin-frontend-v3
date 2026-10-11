import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {ColumnModel} from '@models/core';
import {CoreService, MessageService} from '@services/core';
import {
  CatalogoModel,
  ClasificacionModel,
  HabitacionModel,
  ServicioComplementarioModel,
  TramiteAlojamientoModel
} from '@models/siturin';
import {
  CatalogosSiturinService,
  CategoriasHttpService,
  ClasificacionesHttpService
} from '@services/siturin';
import {ActividadCodigoEnum, CatalogoSiturinTipoEnum, TipoHabitacionCodigoEnum} from '@shared/enums';
import {AuthService} from "@services/auth";
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Tooltip } from 'primeng/tooltip';
import { Divider } from 'primeng/divider';
import { Panel } from 'primeng/panel';
import { LabelDirective } from '../../../../../../legacy/shared/directives/label.directive';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { ErrorMessageDirective } from '../../../../../../legacy/shared/directives/error-message.directive';

import { InputNumber } from 'primeng/inputnumber';
@Component({
    selector: 'app-alojamiento',
    templateUrl: './alojamiento.component.html',
    styleUrls: ['./alojamiento.component.scss'],
    imports: [Bind, Card, TableModule, PrimeTemplate, NgIf, ButtonDirective, NgFor, Ripple, Tooltip, Divider, Panel, LabelDirective, Dialog, ReactiveFormsModule, Select, ErrorMessageDirective, AsyncPipe, DatePipe, InputNumber]
})
export class AlojamientoComponent implements OnInit {
  @Output() alojamientoOut: EventEmitter<any> = new EventEmitter<any>();
  @Input() actividad: AbstractControl = new FormControl();
  @Input() clasificacion: AbstractControl = new FormControl();
  @Input() categoria: AbstractControl = new FormControl();
  @Input() habitaciones: HabitacionModel[] = [];
  @Input() serviciosComplementarios: ServicioComplementarioModel[] = [];
  @Input() esEditable: boolean = false;
  @Input() tramiteAlojamiento: TramiteAlojamientoModel = {};
  columnasTipoHabitacionTabla: ColumnModel[] = this.configurarColumnasTipoHabitacionTablas();
  columnasServiciosComplementariosTabla: ColumnModel[] = this.configurarColumnasServiciosComplementariosTabla();
  totalHabitaciones: number = 0;
  totalPlazas: number = 0;
  totalCamas: number = 0;
  cargado$ = this.coreService.loaded$;
  formulario: FormGroup = this.nuevoFormulario;
  formularioHabitacion: FormGroup = this.nuevoFormularioHabitacion;
  formularioServicioComplementario: FormGroup = this.nuevoFormularioServicioComplementario;
  mostrarDialogoNuevaHabitacion: boolean = false;
  tipoHabitaciones: CatalogoModel[] = [];
  mostrarDialogoNuevoServicioComplementario: boolean = false;
  indexServicioComplementario: number = -1;
  clasificaciones: ClasificacionModel[] | CatalogoModel[] = [];
  indiceHabitacion: number = -1;
  constructor(
    public authService: AuthService,
    private catalogosSiturinService: CatalogosSiturinService,
    private categoriasHttpService: CategoriasHttpService,
    private clasificacionesHttpService: ClasificacionesHttpService,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,) {
  }

  ngOnInit(): void {
    if (!this.esEditable) {
      this.formulario.disable();
    }

    this.obtenerClasificaciones();

    if (this.categoria.value?.id) {
      this.obtenerTipoHabitaciones(this.categoria.value?.id);
    }

    this.serviciosComplementariosField.patchValue(this.serviciosComplementarios);

    this.habitaciones?.forEach(habitacion => {
      this.habitacionesField.value.push(habitacion);
      this.totalHabitaciones += habitacion.habitaciones!;
      this.totalPlazas += habitacion.plazas!;
      this.totalCamas += habitacion.camas!;
    });

    this.habitacionTipoField.valueChanges.subscribe(value => {
      this.habitacionHabitacionesField.setValue(0);
      this.habitacionCamasField.setValue(0);
      this.habitacionPlazasField.setValue(0);
    });

    this.habitacionHabitacionesField.valueChanges.subscribe(value => {
      if (this.habitacionTipoField.value?.codigo === TipoHabitacionCodigoEnum.INDIVIDUAL_SIMPLE) {
        this.calcularHabitacionSimple(value);
      }
      if (this.habitacionTipoField.value?.codigo === TipoHabitacionCodigoEnum.DOBLE) {
        this.calcularHabitacionDoble(value, this.habitacionCamasField.value);
      }
      if (this.habitacionTipoField.value?.codigo === TipoHabitacionCodigoEnum.TRIPLE) {
        this.calcularHabitacionTriple(value, this.habitacionCamasField.value);
      }
      if (this.habitacionTipoField.value?.codigo === TipoHabitacionCodigoEnum.CUADRUPLE) {
        this.calcularHabitacionCuadruple(value, this.habitacionCamasField.value);
      }
    });

    this.formulario.valueChanges.subscribe(value => {
      this.alojamientoOut.emit(value);
    });

    this.alojamientoOut.emit(this.formulario.value);
  }

  obtenerTipoHabitaciones(categoriaId: number) {
    this.categoriasHttpService.obtenerTipoHabitacionesPorCategoria(categoriaId).subscribe(tipoHabitaciones => {
      this.tipoHabitaciones = tipoHabitaciones;
    });
  }

  obtenerClasificaciones() {
    if (this.actividad.value.codigo === ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS) {
      this.clasificacionesHttpService.obtenerClasificacionesParaServiciosComplementarios('alimentos_bebidas_galapagos')
        .subscribe((clasificaciones) => {
          this.clasificaciones = clasificaciones;
        });
    } else if (this.actividad.value.codigo === ActividadCodigoEnum.ALOJAMIENTO_CONTINENTE) {
      this.clasificaciones = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.SERVICIO_COMPLEMENTARIO_CLASIFICACIONES);
    }
  }

  get nuevoFormulario() {
    return this.formBuilder.group({
      habitaciones: [[]],
      tieneServiciosComplementarios: [false],
      tieneModalidadesTurismoAventura: [false],
      modalidadesTurismoAventura: [[]],
      serviciosComplementarios: [[]],
      modalidadesTurismoAventuraAgua: [[]],
      modalidadesTurismoAventuraAire: [[]],
      modalidadesTurismoAventuraTierra: [[]],
      usoSuelos: [false],
    });
  }

  get nuevoFormularioHabitacion() {
    return this.formBuilder.group(
      {
        id: [null],
        tipoHabitacion: [null, [Validators.required]],
        tramite: [null, []],
        camas: [0, [Validators.required, Validators.min(1)]],
        habitaciones: [0, [Validators.required, Validators.min(1)]],
        plazas: [0, [Validators.required, Validators.min(1)]],
        habitacionTarifas: [[]],
        habitacionTarifa: [null],
      }
    );
  }

  get nuevoFormularioServicioComplementario() {
    return this.formBuilder.group(
      {
        clasificacion: [null, [Validators.required]],
        capacidad: [0, [Validators.required,Validators.min(1)]],
      }
    );
  }

  configurarColumnasTipoHabitacionTablas(): ColumnModel[] {
    return [
      {field: 'tipoHabitacion', header: 'Tipo'},
      {field: 'habitaciones', header: 'Habitaciones'},
      {field: 'camas', header: 'Camas'},
      {field: 'plazas', header: 'Plazas'},
    ]
  }

  configurarColumnasServiciosComplementariosTabla(): ColumnModel[] {
    return [
      {field: 'clasificacion', header: 'Clasificación'},
      {field: 'capacidad', header: 'Capacidad en número de personas'},
    ]
  }

  agregarHabitacion() {
    if (this.formularioHabitacion.valid) {
      if (this.indiceHabitacion === -1) {
        this.indiceHabitacion = this.habitacionesField.value.findIndex(
          (element: HabitacionModel) => element.tipoHabitacion?.id === this.habitacionTipoField.value?.id);
      }

      if (this.indiceHabitacion > -1) {
        if (this.actividad.value.codigo === ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS && this.habitacionPlazasField.value > this.habitacionesField.value[this.indiceHabitacion].plazas) {
          this.messageService.getErrorsCustom('No puede aumentar el número de plazas', 'Solo puede mantener o disminuir');
          this.mostrarDialogoNuevaHabitacion = false;
          return;
        }
        this.messageService.getInfoCustom('Actualización', 'La habitación fue actualizada.')
        this.habitacionesField.value[this.indiceHabitacion] = this.formularioHabitacion.value;
      } else {
        this.habitacionesField.value.push(this.formularioHabitacion.value);
      }
      this.formulario.updateValueAndValidity();
      this.totalHabitaciones = 0;
      this.totalPlazas = 0;
      this.totalCamas = 0;
      this.habitacionesField.value.forEach((habitacion: HabitacionModel) => {
        this.totalHabitaciones += habitacion.habitaciones!;
        this.totalPlazas += habitacion.plazas!;
        this.totalCamas += habitacion.camas!;
      });
      this.formularioHabitacion.reset();
      this.mostrarDialogoNuevaHabitacion = false;
    } else {
      this.formularioHabitacion.markAllAsTouched();
    }
  }

  editarHabitacion(indice: number, habitacion: HabitacionModel) {
    this.mostrarDialogoNuevaHabitacion = true;
    this.indiceHabitacion = indice;
    this.formularioHabitacion.patchValue(habitacion);
  }

  eliminarHabitacion(index: number) {
    this.habitacionesField.value.splice(index, 1);
    this.formulario.updateValueAndValidity();
    this.totalHabitaciones = 0;
    this.totalPlazas = 0;
    this.totalCamas = 0;
    this.habitacionesField.value.forEach((habitacion: HabitacionModel) => {
      this.totalHabitaciones += habitacion.habitaciones!;
      this.totalPlazas += habitacion.plazas!;
      this.totalCamas += habitacion.camas!;
    });
  }

  agregarServicioComplementario() {
    if (this.formularioServicioComplementario.valid) {
      if (this.indexServicioComplementario > -1) {
        if (this.clasificacionField.value) {
          this.serviciosComplementariosField.value[this.indexServicioComplementario].clasificacion = this.clasificacionField.value;
        }
        this.serviciosComplementariosField.value[this.indexServicioComplementario].capacidad = this.capacidadField.value;
      } else {
        this.serviciosComplementariosField.value.push(this.formularioServicioComplementario.value);
      }
      this.formulario.updateValueAndValidity();
      this.mostrarDialogoNuevoServicioComplementario = false;
    } else {
      this.formularioServicioComplementario.markAllAsTouched();
    }
  }

  editarServicioComplementario(servicioComplementario: ServicioComplementarioModel, index: number) {
    this.formularioServicioComplementario.patchValue(servicioComplementario);
    if (this.actividad.value?.codigo === ActividadCodigoEnum.ALOJAMIENTO_GALAPAGOS) {
      this.clasificacionField.disable();
    }
    this.mostrarDialogoNuevoServicioComplementario = true;
    this.indexServicioComplementario = index;
  }

  eliminarServicioComplementario(index: number) {
    this.serviciosComplementariosField.value.splice(index, 1);
    this.formulario.updateValueAndValidity();
  }

  calcularHabitacionSimple(habitaciones: number) {
    this.habitacionCamasField.setValue(habitaciones);
    this.habitacionPlazasField.setValue(habitaciones);
  }

  calcularHabitacionDoble(habitaciones: number, camas: number) {
    this.habitacionPlazasField.setValue(habitaciones * 2);
  }

  calcularHabitacionTriple(habitaciones: number, camas: number) {
    this.habitacionPlazasField.setValue(habitaciones * 3);
  }

  calcularHabitacionCuadruple(habitaciones: number, camas: number) {
    this.habitacionPlazasField.setValue(habitaciones * 4);
  }

  validarHabitaciones(): boolean {
    let valido = true;
    if (this.clasificacion.value?.minHabitaciones && this.totalHabitaciones < this.clasificacion.value?.minHabitaciones) {
      valido = false;
    }

    if (this.clasificacion.value?.maxHabitaciones && this.totalHabitaciones > this.clasificacion.value?.maxHabitaciones) {
      valido = false;
    }

    if (this.clasificacion.value?.minPlazas && this.totalPlazas < this.clasificacion.value?.minPlazas) {
      valido = false;
    }

    if (this.clasificacion.value?.maxPlazas && this.totalPlazas > this.clasificacion.value?.maxPlazas) {
      valido = false;
    }

    return valido;
  }

  get habitacionesField() {
    return this.formulario.controls['habitaciones'];
  }

  get serviciosComplementariosField() {
    return this.formulario.controls['serviciosComplementarios'];
  }

  get habitacionTipoField() {
    return this.formularioHabitacion.controls['tipoHabitacion'];
  }

  get habitacionCamasField() {
    return this.formularioHabitacion.controls['camas'];
  }

  get habitacionHabitacionesField() {
    return this.formularioHabitacion.controls['habitaciones'];
  }

  get habitacionPlazasField() {
    return this.formularioHabitacion.controls['plazas'];
  }

  get clasificacionField() {
    return this.formularioServicioComplementario.controls['clasificacion'];
  }

  get capacidadField() {
    return this.formularioServicioComplementario.controls['capacidad'];
  }

}
