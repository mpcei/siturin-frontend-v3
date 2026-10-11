import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { format } from 'date-fns';
import { PrimeIcons } from 'primeng/api';
import { ActividadModel, CatastroModel, DpaModel } from '@/legacy/models/siturin';
import { PaginatorModel } from '@/legacy/models/core';
import { CatastrosHttpService, DpaHttpService, DpaService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { CatalogoSiturinTipoEnum } from '@/legacy/shared/enums';

@Component({
    standalone: false,
    selector: 'app-validador-documento',
    templateUrl: './consulta-catastro.component.html',
    styleUrls: ['./consulta-catastro.component.scss']
})
export class ConsultaCatastroComponent implements OnInit {

     private activatedRoute=inject( ActivatedRoute)
        private catastrosHttpService=inject( CatastrosHttpService)
        private coreService=inject( CoreService)
        private dpaService=inject( DpaService)
        private dpaHttpService=inject( DpaHttpService)
        private messageService=inject( MessageService)

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
    tituloClass: string = 'field xl:col-6 lg:col-6 md:col-6 sm:col-6 text-right titulo';
    textoClass: string = 'field xl:col-6 lg:col-6 md:col-6 sm:col-6 text-left texto';
    provinciaField: FormControl = new FormControl(null);
    cantonField: FormControl = new FormControl(null);
    actividadField: FormControl = new FormControl(null);
    modal: boolean = false;
    paginator: PaginatorModel = this.coreService.paginator;
    URL_VALIDADOR_DOCUMENTO: string = '';

    constructor(

    ) {}

    ngOnInit(): void {
        this.obtenerActividades();
        this.obtenerDpa();

        this.activatedRoute.queryParams.subscribe((params) => {
            if (params['q']) {
                this.numeroRegistroControl.setValue(params['q']);
                this.obtenerDatos(params['q']);
            }
        });

        this.provinciaField.valueChanges.subscribe((value) => {
            if (value?.id) this.configurarDpaCantones(value);
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
            cantonId = this.cantonField.value.id;
        }

        if (this.actividadField.value) {
            actividadCodigo = this.actividadField.value.codigo;
        }

        this.catastrosHttpService.obtenerConsultaCatastros(page, busqueda, provinciaId, cantonId, actividadCodigo).subscribe(
            (response) => {
                this.catastros = response.data;
                this.paginator = response.meta;
                this.cargando = false;
            },
            (error) => (this.cargando = false)
        );
    }

    obtenerQr(catastro: CatastroModel) {
        this.cargando = true;
        this.catastro = catastro;

        this.catastrosHttpService.obtenerConsultaCatastrosQr(this.catastro.numeroRegistro!).subscribe(
            (response) => {
                this.modal = true;
                this.cargando = false;
            },
            (error) => (this.cargando = false)
        );
    }

    obtenerDpa() {
        this.dpaHttpService.obtenerDpa().subscribe((response) => {
            this.dpa = response;
            this.configurarDpaProvincias();
        });
    }

    configurarDpaProvincias() {
        this.provincias = this.dpa.filter((dpa) => dpa.tipo?.codigo === CatalogoSiturinTipoEnum.PROVINCIA);
    }

    configurarDpaCantones(provinciaSeleccionada: DpaModel) {
        const provincia = this.dpa.find((dpa) => dpa.id == provinciaSeleccionada.id);

        if (provincia?.children) {
            this.cantones = provincia?.children;
        }
    }

    obtenerActividades() {
        this.actividades.push(
            {
                codigo: 'alimentos_bebidas',
                nombre: 'ALIMENTOS Y BEBIDAS'
            },
            {
                codigo: 'alojamiento',
                nombre: 'ALOJAMIENTO'
            },
            {
                codigo: 'ctc',
                nombre: 'CENTROS DE TURISMO COMUNITARIO'
            },
            {
                codigo: 'eventos  ',
                nombre: '"ORGANIZADORES DE EVENTOS, CONGRESOS Y CONVENCIONES"'
            },
            {
                codigo: 'operacion_intermediacion',
                nombre: 'AGENCIAMIENTO TURÍSTICO'
            },
            {
                codigo: 'parques',
                nombre: 'PARQUES DE ATRACCIONES ESTABLES'
            },
            {
                codigo: 'transporte',
                nombre: 'TRANSPORTE TURÍSTICO'
            }
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
