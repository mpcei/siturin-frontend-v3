import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { UpdateUserDto, UserModel } from '@models/auth';
import { map } from 'rxjs/operators';
import { ServerResponse, ServerResponsePaginator } from '@models/http-response';
import { CoreService, MessageService } from '@services/core';
import { CatalogueModel, FileModel, PaginatorModel } from '@models/core';
import { AsignacionModel, CatalogoModel, CatastroModel, DpaModel, EstablecimientoModel, InspeccionModel, TramiteModel, ZonalModel } from '@models/siturin';
import { RolesEnum } from '@shared/enums';

@Injectable({
    providedIn: 'root'
})
export class CatastrosHttpService {
    API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/catastros`;
    API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/catastros`;
    private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
    public pagination$ = this.pagination.asObservable();

    constructor(
        private httpClient: HttpClient,
        private coreService: CoreService,
        private messageService: MessageService
    ) {}

    obtenerCatastroTramiteSeleccionado(catastroId: number = 0): Observable<CatastroModel> {
        const url = `${this.API_URL_PRIVATE}/${catastroId}/tramites/seleccionado`;
        const headers = new HttpHeaders().append('origin', 'siturin2');
        this.coreService.showLoad();
        return this.httpClient.get<ServerResponsePaginator>(url, { headers }).pipe(
            map((response) => {
                this.coreService.hideLoad();
                return response.data;
            })
        );
    }

    obtenerCatastroValidadorDocumento(numeroRegistro: string): Observable<CatastroModel> {
        const url = `${this.API_URL_PUBLIC}/validador-documentos`;
        const headers = new HttpHeaders().append('origin', 'siturin2');

        const params = new HttpParams().append('numeroRegistro', numeroRegistro);

        this.coreService.showLoad();
        return this.httpClient.get<ServerResponsePaginator>(url, { params, headers }).pipe(
            map((response) => {
                this.coreService.hideLoad();
                return response.data;
            })
        );
    }

    obtenerDocumento(catastroId: number, codigo: string) {
        const url = `${this.API_URL_PRIVATE}/${catastroId}/documentos/${codigo}/descargar`;
        const headers = new HttpHeaders().append('origin', 'siturin2');
        return this.httpClient.get(url, { responseType: 'blob' as 'json', headers });
    }

    obtenerDocumentoUsuarioExterno(catastroId: number, codigo: string) {
        const url = `${this.API_URL_PRIVATE}/${catastroId}/documentos-externo/${codigo}/descargar`;
        const headers = new HttpHeaders().append('origin', 'siturin2');
        return this.httpClient.get(url, { responseType: 'blob' as 'json', headers });
    }

    obtenerDocumentoTodos(catastroId: number, codigo: string) {
        const url = `${this.API_URL_PRIVATE}/${catastroId}/documentos/${codigo}/descargar-todos`;
        const headers = new HttpHeaders().append('origin', 'siturin2');
        return this.httpClient.get(url, { responseType: 'blob' as 'json', headers });
    }

    obtenerCatastroReportePorDAC(filtro: any = null): Observable<any> {
        const url = `${this.API_URL_PRIVATE}/reportes/dac`;
        console.log('descargando');
        const headers = new HttpHeaders().append('origin', 'siturin2');
        return this.httpClient.patch<ServerResponsePaginator>(url, { filtro, headers }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    obtenerCatastroReportePorDACBackup(filtro: any = null) {
        const url = `${this.API_URL_PRIVATE}/reportes/dac`;
        const headers = new HttpHeaders().append('origin','siturin2');
        return this.httpClient.patch(url, { filtro }, { responseType: 'blob' as 'json',headers });
    }

    obtenerCatastroReportePorGAD(filtro: any = null) {
        const url = `${this.API_URL_PRIVATE}/reportes/gad`;
        const headers = new HttpHeaders().append('origin','siturin2');
        return this.httpClient.patch<ServerResponsePaginator>(url, { filtro,headers }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    obtenerCatastroReportePorGADBackup(filtro: any = null) {
        const url = `${this.API_URL_PRIVATE}/reportes/gad`;
        const headers = new HttpHeaders().append('origin','siturin2');
        return this.httpClient.patch(url, { filtro }, { responseType: 'blob' as 'json',headers });
    }

    obtenerCatastroReportePorZonal(filtro: any = null) {
        const url = `${this.API_URL_PRIVATE}/reportes/zonal`;
        const headers = new HttpHeaders().append('origin','siturin2');
        return this.httpClient.patch<ServerResponsePaginator>(url, { filtro ,headers}).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    obtenerCatastroReportePorZonalBackup(filtro: any = null) {
        const url = `${this.API_URL_PRIVATE}/reportes/zonal`;
        const headers = new HttpHeaders().append('origin','siturin2');
        return this.httpClient.patch(url, { filtro }, { responseType: 'blob' as 'json',headers });
    }

    obtenerCatastrosPorDAC(page: number = 0, buscador: any = null, filtro: any = null): Observable<CatastroModel[]> {
        const url = `${this.API_URL_PRIVATE}/catastrados-dac`;
        const headers = new HttpHeaders().append('pagination', 'true').append('origin','siturin2');
        let params = new HttpParams().append('page', page);

        this.coreService.showLoad();
        return this.httpClient.patch<ServerResponsePaginator>(url, { buscador, filtro }, { params, headers }).pipe(
            map((response) => {
                this.coreService.hideLoad();
                if (response.meta) {
                    this.pagination.next(response.meta);
                }
                return response.data;
            })
        );
    }

    obtenerCatastrosPorGAD(page: number = 0, buscador: any = null, filtro: any = null): Observable<CatastroModel[]> {
        const url = `${this.API_URL_PRIVATE}/catastrados-gad`;
        const headers = new HttpHeaders().append('pagination', 'true').append('origin','siturin2');
        let params = new HttpParams().append('page', page);
        this.coreService.showLoad();
        return this.httpClient.patch<ServerResponsePaginator>(url, { buscador, filtro }, { params, headers }).pipe(
            map((response) => {
                this.coreService.hideLoad();
                if (response.meta) {
                    this.pagination.next(response.meta);
                }
                return response.data;
            })
        );
    }

    obtenerCatastrosPorZonal(page: number = 0, buscador: any = null, filtro: any = null): Observable<CatastroModel[]> {
        const url = `${this.API_URL_PRIVATE}/catastrados-zonal`;
        const headers = new HttpHeaders().append('pagination', 'true').append('origin','siturin2');
        let params = new HttpParams().append('page', page);
        this.coreService.showLoad();
        return this.httpClient.patch<ServerResponsePaginator>(url, { buscador, filtro }, { params, headers }).pipe(
            map((response) => {
                this.coreService.hideLoad();
                if (response.meta) {
                    this.pagination.next(response.meta);
                }
                return response.data;
            })
        );
    }

    guardarCatastroInterno(catastroId: number, rol: string, payload: CatastroModel): Observable<CatastroModel> {
        switch (rol) {
            case RolesEnum.DAC:
                rol = 'dac';
                break;
            case RolesEnum.GAD:
                rol = 'gad';
                break;
            case RolesEnum.TECNICO_ZONAL:
                rol = 'zonal';
                break;
        }
        const url = `${this.API_URL_PRIVATE}/${catastroId}/catastrados-${rol}`;
        const headers = new HttpHeaders().append('origin','siturin2');

        this.coreService.showLoad();
        return this.httpClient.post<ServerResponse>(url, payload,{headers}).pipe(
            map((response) => {
                this.coreService.hideLoad();
                this.messageService.success(response);
                return response.data;
            })
        );
    }

    guardarCatastroPorDAC2(catastroId: number, payload: CatastroModel): Observable<CatastroModel> {
        const url = `${this.API_URL_PRIVATE}/${catastroId}/catastrados-dac`;
        const headers = new HttpHeaders().append('origin','siturin2');
        this.coreService.showLoad();
        return this.httpClient.post<ServerResponse>(url, payload,{headers}).pipe(
            map((response) => {
                this.coreService.hideLoad();
                this.messageService.success(response);
                return response.data;
            })
        );
    }

    guardarAdjuntoCatastroPorDAC(catastroId: number, payload: FormData): Observable<CatastroModel> {
        const url = `${this.API_URL_PRIVATE}/${catastroId}/catastrados-dac/adjunto`;
        const headers = new HttpHeaders().append('origin','siturin2');
        this.coreService.showLoad();
        return this.httpClient.post<ServerResponse>(url, payload).pipe(
            map((response) => {
                this.coreService.hideLoad();
                return response.data;
            })
        );
    }

    obtenerConsultaCatastros(page = 1, busqueda: string, provinciaId: number | null, cantonId: number | null, actividadCodigo: string | null): Observable<ServerResponsePaginator> {
        const url = `${this.API_URL_PUBLIC}/consulta-catastros`;

        let params = new HttpParams().append('page', page).append('busqueda', busqueda);

        if (provinciaId) {
            params = params.append('provinciaId', provinciaId);
        }

        if (cantonId) {
            params = params.append('cantonId', cantonId);
        }

        if (actividadCodigo) {
            params = params.append('actividadCodigo', actividadCodigo);
        }

        this.coreService.showLoad();
        return this.httpClient.get<ServerResponsePaginator>(url, { params }).pipe(
            map((response) => {
                this.coreService.hideLoad();
                return response;
            })
        );
    }

    obtenerConsultaCatastrosQr(numeroRegistro: string): Observable<ServerResponsePaginator> {
        const url = `${this.API_URL_PUBLIC}/consulta-catastros-qr`;

        let params = new HttpParams().append('numeroRegistro', numeroRegistro);

        this.coreService.showLoad();
        return this.httpClient.get<ServerResponsePaginator>(url, { params }).pipe(
            map((response) => {
                this.coreService.hideLoad();
                return response;
            })
        );
    }
}
