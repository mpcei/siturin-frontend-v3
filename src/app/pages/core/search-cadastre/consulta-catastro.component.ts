import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CatastrosHttpService, DpaHttpService, DpaService } from '@services/siturin';
import { ActividadModel, CatastroModel, DpaModel } from '@models/siturin';
import { CoreService, MessageService } from '@services/core';
import { PaginatorModel } from '@models/core';
import { environment } from '@env/environment';
import { format } from 'date-fns';
import { CatalogoSiturinTipoEnum } from '@shared/enums';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Paginator } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { Popover } from 'primeng/popover';
import { InputGroup } from 'primeng/inputgroup';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { FileHttpService } from '@utils/services';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-validador-documento',
    templateUrl: './consulta-catastro.component.html',
    imports: [
        Select,
        ReactiveFormsModule,
        Button,
        InputText,
        Paginator,
        TableModule,
        Popover,
        FormsModule,
        InputGroup,
        Tooltip
    ],
    styleUrls: ['./consulta-catastro.component.scss']
})
export class ConsultaCatastroComponent implements OnInit {

    private fileHttpService = inject(FileHttpService);
    private catastrosHttpService = inject(CatastrosHttpService);
    private coreService = inject(CoreService);
    private dpaService = inject(DpaService);
    private dpaHttpService = inject(DpaHttpService);
    private messageService = inject(MessageService);
    protected readonly environment = environment;
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly FontAwesome = FontAwesome;

    numeroRegistroControl: FormControl = new FormControl<string>('', [Validators.required]);
    rucSearch = signal('');
    tradeNameSearch = signal('');
    legalNameSearch = signal('');
    cadastreFile = signal(null);

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
    provinciaField: FormControl = new FormControl(null);
    cantonField: FormControl = new FormControl(null);
    actividadField: FormControl = new FormControl(null);
    modal: boolean = false;
    paginator: PaginatorModel = this.coreService.paginator;
    URL_VALIDADOR_DOCUMENTO: string = '';

    constructor() {
        toObservable(this.rucSearch)
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.findCadastre();
            });

        toObservable(this.tradeNameSearch)
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.findCadastre();
            });

        toObservable(this.legalNameSearch)
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.findCadastre();
            });
    }

    ngOnInit(): void {
        this.findCadastreFile();
        this.obtenerActividades();
        this.obtenerDpa();

        this.provinciaField.valueChanges.subscribe(value => {
            if (value?.id)
                this.configurarDpaCantones(value);
        });
    }

    findCadastre(page = 1) {
        this.catastros = [];
        this.catastro = {};
        this.cargando = true;

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

        this.catastrosHttpService.obtenerConsultaCatastros({
            page,
            provinciaId,
            cantonId,
            actividadCodigo,
            ruc: this.rucSearch(),
            tradeName: this.tradeNameSearch(),
            legalName: this.legalNameSearch(),
        }).subscribe({
            next: response => {
                this.catastros = response.data;
                this.paginator = response.pagination;
                this.cargando = false;
            },
            error: error => this.cargando = false
        });
    }

    findCadastreFile() {
        this.catastrosHttpService.findCadastreFile().subscribe({
            next: response => {
                console.log(response.file);
                this.cadastreFile.set(response.file);
            }
        });
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
                codigo: 'eventos  ', nombre: 'ORGANIZADORES DE EVENTOS, CONGRESOS Y CONVENCIONES'
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
                codigo: 'guias', nombre: 'GUIANZA TURÍSTICA'
            }
        );

        this.actividades.sort()
    }

    mostrarModal(catastro: CatastroModel) {
        this.catastro = catastro;
        this.URL_VALIDADOR_DOCUMENTO = `${environment.URL_VALIDADOR_DOCUMENTO}${catastro.numeroRegistro}&fecha=${format(new Date(), 'yyyy-MM-dd_HH:mm:ss')}`;
        this.modal = true;
    }

    paginate(event: any) {
        this.findCadastre(event.page + 1);
    }

    mostrarEstado(op: any, event: any, descripcion: string) {
        op.toggle(event);
        this.descripcion = descripcion;
    }

    downloadCadastre() {
        console.log(this.cadastreFile());
        this.catastrosHttpService.downloadCadastreFile(this.cadastreFile());
    }

    goToDownloadCadastre() {
        window.open('https://serviciosturismo.economicoproductivo.gob.ec/catastro-turistico');
    }
}
