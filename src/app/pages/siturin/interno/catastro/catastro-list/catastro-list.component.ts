import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ColumnModel, PaginatorModel } from '@models/core';
import { CatastroModel, DpaModel, TramiteModel, ZonalModel } from '@models/siturin';
import { AuthService } from '@services/auth';
import { CoreService, MessageService } from '@services/core';
import { CatastrosHttpService, TecnicoZonalHttpService } from '@services/siturin';
import { CatastroEstadoEnum, RolesEnum } from '@shared/enums';
// @ts-ignore
import * as FileSaver from 'file-saver';
import { format } from 'date-fns';
import { NgIf, NgFor, NgSwitch, NgSwitchCase, NgSwitchDefault, AsyncPipe, DatePipe } from '@angular/common';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Paginator } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { PrimeTemplate } from 'primeng/api';
import { Ripple } from 'primeng/ripple';
import { Tooltip } from 'primeng/tooltip';
import { CatastroFormComponent } from '../catastro-form/catastro-form.component';
import { Dialog } from 'primeng/dialog';
import { ProgressBarComponent } from '../../../../../legacy/shared/components/progress-bar/progress-bar.component';

@Component({
    selector: 'app-catastro-list',
    templateUrl: './catastro-list.component.html',
    styleUrls: ['./catastro-list.component.scss'],
    imports: [
        NgIf,
        Bind,
        Card,
        ReactiveFormsModule,
        Select,
        ButtonDirective,
        InputText,
        Paginator,
        TableModule,
        PrimeTemplate,
        NgFor,
        Ripple,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        Tooltip,
        CatastroFormComponent,
        Dialog,
        ProgressBarComponent,
        AsyncPipe,
        DatePipe
    ]
})
export class CatastroListComponent implements OnInit {
    public authService = inject(AuthService);
    private catastrosHttpService = inject(CatastrosHttpService);
    private formBuilder = inject(FormBuilder);
    public messageService = inject(MessageService);
    private coreService = inject(CoreService);
    private tecnicoZonalHttpService = inject(TecnicoZonalHttpService);
    catastros: CatastroModel[] = [];
    catastroSeleccionado: CatastroModel = {};
    cargando: boolean = false;
    cargandoReporteCatastro: boolean = false;
    columnasTabla: ColumnModel[] = this.configurarColumnasTabla;
    pagination$ = this.catastrosHttpService.pagination$;
    paginator: PaginatorModel = this.coreService.paginator;
    loaded$ = this.coreService.loaded$;
    refrescar = true;
    esVisibleCatastro: boolean = false;
    buscador: FormGroup = this.nuevoBuscadorFormulario;
    tiposFiltro: any[] = [];
    filtro: FormGroup = this.nuevoFiltroFormulario;
    actividades: any[] = [];
    catastroEstados: any[] = [];
    dpaControl: FormControl = new FormControl<DpaModel[]>([]);
    zonales: ZonalModel[] = [];
    dpa: DpaModel[] = [];
    titulo: string = '';
    catastroExport: any = null;

    constructor() {
        this.pagination$.subscribe((paginator) => (this.paginator = paginator));
    }

    ngOnInit(): void {
        this.zonales = this.authService.zonales;
        if (this.zonales.length > 0) {
            this.zonalField.patchValue(this.zonales[0]);
        }

        this.dpa = this.authService.usuarioInterno.dpa!;
        if (this.dpa.length > 0) {
            this.dpaField.patchValue(this.dpa[0]);
        }

        this.obtenerCatastros();
        this.valorField.valueChanges.pipe(debounceTime(1500)).subscribe((value) => {
            this.obtenerCatastros(1, this.buscador.value);
        });

        this.tiposFiltro = [
            { codigo: 'ruc', nombre: 'RUC' },
            { codigo: 'nombreComercial', nombre: 'Nombre Comercial' }
        ];

        this.tipoField.patchValue({ codigo: 'ruc', nombre: 'RUC' });

        this.actividades = [
            { codigo: 'alimentos_bebidas', nombre: 'Alimentos y Bebidas' },
            { codigo: 'alojamiento', nombre: 'Alojamiento' },
            { codigo: 'operacion_intermediacion', nombre: 'Operación e Intermedación' },
            { codigo: 'ctc', nombre: 'Centros de Turismo Comunitario' },
            { codigo: 'transporte', nombre: 'Transporte Turístico' },
            { codigo: 'parques', nombre: 'Parques de Atracciones Estables' },
            { codigo: 'eventos', nombre: 'Organizadores de Eventos, Congresos y Convenciones' }
        ];

        this.catastroEstados = [
            { codigo: CatastroEstadoEnum.RATIFICADO, nombre: 'Ratificado' },
            { codigo: CatastroEstadoEnum.RECLASIFICADO_OFICIO, nombre: 'Reclasificado por Oficio' },
            { codigo: CatastroEstadoEnum.RECATEGORIZADO_OFICIO, nombre: 'Recategorizado por Oficio' },
            { codigo: CatastroEstadoEnum.INACTIVO, nombre: 'Inactivo' },
            { codigo: CatastroEstadoEnum.PENDIENTE_INSPECCION, nombre: 'Pendiente de Inspección' }
        ];

        this.dpaControl.patchValue(this.authService.dpa);
    }

    obtenerCatastros(page: number = 1, buscador: any = null) {
        switch (this.authService.role.name) {
            case RolesEnum.DAC:
                this.catastrosHttpService.obtenerCatastrosPorDAC(page, buscador, this.filtro.value).subscribe((catastros) => {
                    this.catastros = catastros;
                });
                this.titulo = 'Administrador del Catastro Turístico Nacional - Técnico DAC';
                break;
            case RolesEnum.GAD:
                this.catastrosHttpService.obtenerCatastrosPorGAD(page, buscador, this.filtro.value).subscribe((catastros) => {
                    this.catastros = catastros;
                });
                this.titulo = 'Administrador del Catastro Turístico Nacional - Técnico GAD';
                break;
            case RolesEnum.TECNICO_ZONAL:
                this.catastrosHttpService.obtenerCatastrosPorZonal(page, buscador, this.filtro.value).subscribe((catastros) => {
                    this.catastros = catastros;
                });
                this.titulo = 'Administrador del Catastro Turístico Nacional - Técnico Zonal';
                break;
        }
    }

    get configurarColumnasTabla(): ColumnModel[] {
        return [
            { field: 'numeroEstablecimiento', header: 'Nro.' },
            { field: 'nombreEstablecimiento', header: 'Nombre Establecimiento' },
            { field: 'numeroRegistro', header: 'Número de Registro' },
            { field: 'ubicacion', header: 'Ubicación' },
            { field: 'estado', header: 'Estado Registro' },
            { field: 'actividad', header: 'Actividad' }
        ];
    }

    get nuevoBuscadorFormulario() {
        return this.formBuilder.group({
            tipo: [null],
            valor: [null]
        });
    }

    get nuevoFiltroFormulario() {
        return this.formBuilder.group({
            actividad: [null],
            estado: [null],
            zonal: [null],
            dpa: [null]
        });
    }

    paginar(event: any) {
        if (this.buscador.value) this.obtenerCatastros(event.page + 1, this.buscador.value);
        else this.obtenerCatastros(event.page + 1);
    }

    mostrarCatastro(catastro: CatastroModel) {
        this.catastrosHttpService.obtenerCatastroTramiteSeleccionado(catastro.id).subscribe((catastroTramiteSeleccionado) => {
            this.catastroSeleccionado = catastroTramiteSeleccionado;
            this.esVisibleCatastro = true;
        });
    }

    descargarCatastro() {
        switch (this.authService.role.name) {
            case RolesEnum.DAC:
                this.cargandoReporteCatastro = true;
                console.log('descargando');
                this.catastrosHttpService.obtenerCatastroReportePorDAC(this.filtro.value).subscribe(
                    (documento) => {
                        // this.coreService.descargarDocumentoXLSX(documento, 'catastro');
                        // this.catastroExport = documento.map((documento: any) => {
                        //   return {
                        //     ruc: documento.ruc
                        //   }
                        // });
                        this.catastroExport = documento;
                        // this.cargandoReporteCatastro = false;
                        this.exportExcel();
                    },
                    (error) => (this.cargandoReporteCatastro = false)
                );
                break;
            case RolesEnum.GAD:
                this.cargandoReporteCatastro = true;
                this.catastrosHttpService.obtenerCatastroReportePorGAD(this.filtro.value).subscribe(
                    (documento) => {
                        // this.coreService.descargarDocumentoXLSX(documento, 'catastro');
                        this.catastroExport = documento;

                        this.exportExcel();
                        // this.cargandoReporteCatastro = false;
                    },
                    (error) => (this.cargandoReporteCatastro = false)
                );
                break;
            case RolesEnum.TECNICO_ZONAL:
                this.cargandoReporteCatastro = true;
                this.catastrosHttpService.obtenerCatastroReportePorZonal(this.filtro.value).subscribe(
                    (documento) => {
                        // this.coreService.descargarDocumentoXLSX(documento, 'catastro');
                        this.catastroExport = documento;
                        this.exportExcel();
                        // this.cargandoReporteCatastro = false;
                    },
                    (error) => (this.cargandoReporteCatastro = false)
                );
                break;
        }
    }

    descargarGestionTramites() {
        this.cargando = true;
        this.tecnicoZonalHttpService.generarReporteTramitesXLSX();
    }

    get tipoField() {
        return this.buscador.controls['tipo'];
    }

    get valorField() {
        return this.buscador.controls['valor'];
    }

    get actividadField() {
        return this.filtro.controls['actividad'];
    }

    get estadoField() {
        return this.filtro.controls['estado'];
    }

    get zonalField() {
        return this.filtro.controls['zonal'];
    }

    get dpaField() {
        return this.filtro.controls['dpa'];
    }

    exportExcel() {
        import('xlsx').then((xlsx) => {
            const worksheet = xlsx.utils.json_to_sheet(this.catastroExport);
            const workbook = { Sheets: { Catastros: worksheet }, SheetNames: ['Catastros'] };
            const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, 'catastro_' + format(new Date(), 'yyyy-MM-dd HH:mm:ss'));
            this.cargandoReporteCatastro = false;
        });
    }

    saveAsExcelFile(buffer: any, fileName: string): void {
        let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.xlsx';
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    }

    protected readonly RolesEnum = RolesEnum;
}
