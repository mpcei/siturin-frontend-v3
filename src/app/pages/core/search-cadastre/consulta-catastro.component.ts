import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatastrosHttpService, DpaHttpService, DpaService } from '@services/siturin';
import { ActividadModel, CatastroModel, DpaModel } from '@models/siturin';
import { CoreService, MessageService } from '@services/core';
import { PaginatorModel } from '@models/core';
import { environment } from '@env/environment';
import { format } from 'date-fns';
import { CatalogoSiturinTipoEnum } from '@shared/enums';
import { PrimeIcons } from 'primeng/api';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { Button, ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Paginator } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { QRCodeComponent } from 'angularx-qrcode';
import { Popover } from 'primeng/popover';

@Component({
    selector: 'app-validador-documento',
    templateUrl: './consulta-catastro.component.html',
    imports: [
        Card,
        Select,
        ReactiveFormsModule,
        Button,
        InputText,
        Paginator,
        TableModule,
        ButtonDirective,
        Dialog,
        QRCodeComponent,
        Popover
    ],
    styleUrls: ['./consulta-catastro.component.scss']
})
export class ConsultaCatastroComponent implements OnInit {
  numeroRegistroControl: FormControl = new FormControl<string>('', [Validators.required]);
  catastro: CatastroModel = {};
  catastros: CatastroModel[] = [];
  actividades: ActividadModel[] = [];
  provincias: DpaModel[] = [];
  dpa: DpaModel[] = [];
  cantones: DpaModel[] = [];
  cargando: boolean = false;
  totalHabitaciones: number = 0;
  totalCamas: number = 0;
  totalPlazas: number = 0;
  totalCapacidades: number = 0;
  descripcion: string = '';
  tituloClass: string = 'field xl:col-6 lg:col-6 md:col-6 sm:col-6 text-right titulo'
  textoClass: string = 'field xl:col-6 lg:col-6 md:col-6 sm:col-6 text-left texto'
  provinciaField: FormControl = new FormControl(null);
  cantonField: FormControl = new FormControl(null);
  actividadField: FormControl = new FormControl(null);
  modal: boolean = false;
  paginator: PaginatorModel = this.coreService.paginator;
  URL_VALIDADOR_DOCUMENTO: string = '';

  constructor(private activatedRoute: ActivatedRoute,
              private catastrosHttpService: CatastrosHttpService,
              private coreService: CoreService,
              private dpaService: DpaService,
              private dpaHttpService: DpaHttpService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.obtenerActividades();
    this.obtenerDpa();

    this.activatedRoute.queryParams.subscribe(params => {
      if (params['q']) {
        this.numeroRegistroControl.setValue(params['q']);
        this.obtenerDatos(params['q']);
      }
    });

    this.provinciaField.valueChanges.subscribe(value => {
      if (value?.id)
        this.configurarDpaCantones(value);
    });
  }

  consultar(event: any, busqueda: string) {
    if (event.keyCode === 13) {
      this.obtenerDatos(busqueda);
    }
  }

  obtenerDatos(busqueda: string, page = 1) {
    this.catastros = [];
    this.catastro = {};
    this.cargando = true;
    busqueda = busqueda?.trim();


    let provinciaId = null;
    let cantonId = null;
    let actividadCodigo = null;

    if (this.provinciaField.value) {
      provinciaId = this.provinciaField.value.id;
    }

    if (this.cantonField.value) {
      cantonId = this.cantonField.value.nombre;
    }

    if (this.actividadField.value) {
      actividadCodigo = this.actividadField.value.nombre;
    }

    this.catastrosHttpService.obtenerConsultaCatastros(page, busqueda, provinciaId, cantonId, actividadCodigo).subscribe(response => {
      this.catastros = response.data;
      this.paginator = response.pagination;
      this.cargando = false;
    }, error => this.cargando = false);
  }

  obtenerQr(catastro: CatastroModel) {
    this.cargando = true;
    this.catastro = catastro;

    this.catastrosHttpService.obtenerConsultaCatastrosQr(this.catastro.numeroRegistro!).subscribe(response => {
      this.modal = true;
      this.cargando = false;
    }, error => this.cargando = false);
  }

  obtenerDpa() {
    this.dpaHttpService.obtenerDpa().subscribe(response => {
      this.dpa = response;
      this.configurarDpaProvincias();
    });
  }

  configurarDpaProvincias() {
    this.provincias = this.dpa.filter(dpa => dpa.tipo?.codigo === CatalogoSiturinTipoEnum.PROVINCIA);
  }

  configurarDpaCantones(provinciaSeleccionada: DpaModel) {
    const provincia = this.dpa.find(dpa => dpa.id == provinciaSeleccionada.id);

    if (provincia?.children) {
      this.cantones = provincia?.children;
    }
  }

  obtenerActividades() {
    this.actividades.push(
      {
        codigo: 'alimentos_bebidas', nombre: 'ALIMENTOS Y BEBIDAS'
      },
      {
        codigo: 'alojamiento', nombre: 'ALOJAMIENTO'
      },
      {
        codigo: 'ctc', nombre: 'CENTROS DE TURISMO COMUNITARIO'
      },
      {
        codigo: 'eventos  ', nombre: '"ORGANIZADORES DE EVENTOS, CONGRESOS Y CONVENCIONES"'
      },
      {
        codigo: 'operacion_intermediacion', nombre: 'AGENCIAMIENTO TURÍSTICO'
      },
      {
        codigo: 'parques', nombre: 'PARQUES DE ATRACCIONES ESTABLES'
      },
      {
        codigo: 'transporte', nombre: 'TRANSPORTE TURÍSTICO'
      },
      {
        codigo: 'guias', nombre: 'TRANSPORTE TURÍSTICO'
      },
    );
  }

  mostrarModal(catastro: CatastroModel) {
    this.catastro = catastro;
    this.URL_VALIDADOR_DOCUMENTO = `${environment.URL_VALIDADOR_DOCUMENTO}${catastro.numeroRegistro}&fecha=${format(new Date(), 'yyyy-MM-dd_HH:mm:ss')}`;
    this.modal = true;
  }

  paginate(event: any) {
    this.obtenerDatos(this.numeroRegistroControl.value, event.page + 1);
  }

  mostrarEstado(op: any, event: any, descripcion: string) {
    op.toggle(event);
    this.descripcion = descripcion;
  }

  protected readonly environment = environment;
  protected readonly PrimeIcons = PrimeIcons;
}
