import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {UpdateUserDto, UserModel} from '@models/auth';
import {map} from 'rxjs/operators';
import {ServerResponse, ServerResponsePaginator} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CatalogueModel, FileModel, PaginatorModel} from '@models/core';
import {
  AsignacionModel,
  CatalogoModel, CatastroModel,
  DpaModel,
  EstablecimientoModel,
  InspeccionModel,
  TramiteModel, ZonalModel
} from '@models/siturin';
import {RolesEnum} from '@shared/enums';

@Injectable({
  providedIn: 'root'
})
export class CatastrosHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/catastros`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/catastros`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  obtenerCatastroTramiteSeleccionado(catastroId: number = 0): Observable<CatastroModel> {
    const url = `${this.API_URL_PRIVATE}/${catastroId}/tramites/seleccionado`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponsePaginator>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  obtenerCatastroValidadorDocumento(numeroRegistro: string): Observable<CatastroModel> {
    const url = `${this.API_URL_PUBLIC}/validador-documentos`;

    const params = new HttpParams().append('numeroRegistro', numeroRegistro);

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponsePaginator>(url, {params}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  obtenerDocumento(catastroId: number, codigo: string) {
    const url = `${this.API_URL_PRIVATE}/${catastroId}/documentos/${codigo}/descargar`;
    return this.httpClient.get(url, {responseType: 'blob' as 'json'});
  }

  obtenerDocumentoUsuarioExterno(catastroId: number, codigo: string) {
    const url = `${this.API_URL_PRIVATE}/${catastroId}/documentos-externo/${codigo}/descargar`;
    return this.httpClient.get(url, {responseType: 'blob' as 'json'});
  }

  obtenerDocumentoTodos(catastroId: number, codigo: string) {
    const url = `${this.API_URL_PRIVATE}/${catastroId}/documentos/${codigo}/descargar-todos`;
    return this.httpClient.get(url, {responseType: 'blob' as 'json'});
  }

  obtenerCatastroReportePorDAC(filtro: any = null): Observable<any> {
    const url = `${this.API_URL_PRIVATE}/reportes/dac`;
    return this.httpClient.patch<ServerResponsePaginator>(url, {filtro}).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  obtenerCatastroReportePorDACBackup(filtro: any = null) {
    const url = `${this.API_URL_PRIVATE}/reportes/dac`;
    return this.httpClient.patch(url, {filtro}, {responseType: 'blob' as 'json'});
  }

  obtenerCatastroReportePorGAD(filtro: any = null) {
    const url = `${this.API_URL_PRIVATE}/reportes/gad`;
    return this.httpClient.patch<ServerResponsePaginator>(url, {filtro}).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  obtenerCatastroReportePorGADBackup(filtro: any = null) {
    const url = `${this.API_URL_PRIVATE}/reportes/gad`;
    return this.httpClient.patch(url, {filtro}, {responseType: 'blob' as 'json'});
  }

  obtenerCatastroReportePorZonal(filtro: any = null) {
    const url = `${this.API_URL_PRIVATE}/reportes/zonal`;
    return this.httpClient.patch<ServerResponsePaginator>(url, {filtro}).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  obtenerCatastroReportePorZonalBackup(filtro: any = null) {
    const url = `${this.API_URL_PRIVATE}/reportes/zonal`;
    return this.httpClient.patch(url, {filtro}, {responseType: 'blob' as 'json'});
  }

  obtenerCatastrosPorDAC(page: number = 0, buscador: any = null, filtro: any = null): Observable<CatastroModel[]> {
    const url = `${this.API_URL_PRIVATE}/catastrados-dac`;
    const headers = new HttpHeaders().append('pagination', 'true');
    let params = new HttpParams().append('page', page);

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponsePaginator>(url, {buscador, filtro}, {params, headers}).pipe(
      map(response => {
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
    const headers = new HttpHeaders().append('pagination', 'true');
    let params = new HttpParams().append('page', page);
    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponsePaginator>(url, {buscador, filtro}, {params, headers}).pipe(
      map(response => {
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
    const headers = new HttpHeaders().append('pagination', 'true');
    let params = new HttpParams().append('page', page);
    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponsePaginator>(url, {buscador, filtro}, {params, headers}).pipe(
      map(response => {
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

    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarCatastroPorDAC2(catastroId: number, payload: CatastroModel): Observable<CatastroModel> {
    const url = `${this.API_URL_PRIVATE}/${catastroId}/catastrados-dac`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarAdjuntoCatastroPorDAC(catastroId: number, payload: FormData): Observable<CatastroModel> {
    const url = `${this.API_URL_PRIVATE}/${catastroId}/catastrados-dac/adjunto`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  obtenerConsultaCatastros(page = 1, busqueda: string, provinciaId: number | null, cantonId: number | null, actividadCodigo: string | null): Observable<ServerResponsePaginator> {
    const url = `${this.API_URL_PUBLIC}/consulta-catastros`;

    let params = new HttpParams()
      .append('page', page)
      .append('busqueda', busqueda);

    if (provinciaId) {
      params = params.append('provinciaId', provinciaId)
    }

    if (cantonId) {
      params = params.append('cantonId', cantonId)
    }

    if (actividadCodigo) {
      params = params.append('actividadCodigo', actividadCodigo)
    }


    this.coreService.showLoad();
    return this.httpClient.get<ServerResponsePaginator>(url, {params}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response;
      })
    );
  }

  obtenerConsultaCatastrosQr(numeroRegistro: string): Observable<ServerResponsePaginator> {
    const url = `${this.API_URL_PUBLIC}/consulta-catastros-qr`;

    let params = new HttpParams().append('numeroRegistro', numeroRegistro);

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponsePaginator>(url, {params}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response;
      })
    );
  }
}
