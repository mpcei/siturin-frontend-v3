import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse, ServerResponsePaginator} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {PaginatorModel} from '@models/core';
import {AsignacionModel, TramiteModel} from '@models/siturin';
import {format} from "date-fns";
import {CoreEnum} from "@shared/enums";

@Injectable({
  providedIn: 'root'
})
export class EspecialistaZonalHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/especialista-zonales`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/especialista-zonales`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  generarReporteTramitesPorZonalXLSX(zonalId: number) {
    const url = `${this.API_URL_PRIVATE}/${zonalId}/tramites/reportes`;
    const params = new HttpParams().append('tipo', CoreEnum.XLSX);
    return this.httpClient.get(url, {params, responseType: 'blob' as 'json'}).subscribe(reporte => {
      this.coreService.descargarDocumentoXLSX(reporte, 'bandeja_especialista_zonal_' + format(new Date(), 'yyyy_mm_dd HH_mm_ss'));
    });
  }

  obtenerAsignacionesPorTramiteTodos(tramiteId: number): Observable<AsignacionModel[]> {
    const url = `${this.API_URL_PRIVATE}/tramites/${tramiteId}/todos`;
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  reasignarTramiteTecnicoZonal(tramiteId: number, usuarioInternoId: number, payload: AsignacionModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/tramites/${tramiteId}/usuarios-internos/${usuarioInternoId}/tecnico-zonal`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  obtenerTramitesAtendidosPorZonal(zonaId: number, dpaId: number, page: number = 0, buscador: any = null, filtro: any = null): Observable<ServerResponsePaginator> {
    const url = `${this.API_URL_PRIVATE}/atendidos/zonales/${zonaId}`;

    const headers = new HttpHeaders().append('pagination', 'true');
    let params = new HttpParams().append('page', page);

    if (dpaId != undefined) {
      params = params.append('dpaId', JSON.stringify(dpaId));
    }

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponsePaginator>(url, {buscador, filtro}, {params, headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response;
      })
    );
  }

  obtenerTramitesNoAtendidosPorZonal(zonaId: number, dpaId: number, page: number = 0, buscador: any = null, filtro: any = null): Observable<ServerResponsePaginator> {
    const url = `${this.API_URL_PRIVATE}/no-atendidos/zonales/${zonaId}`;
    const headers = new HttpHeaders().append('pagination', 'true');
    let params = new HttpParams().append('page', page);

    if (dpaId != undefined) {
      params = params.append('dpaId', JSON.stringify(dpaId));
    }

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponsePaginator>(url, {buscador, filtro}, {params, headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response;
      })
    );
  }

  obtenerTramitesSinAsignarPorZonal(zonaId: number, dpaId: number, page: number = 0, buscador: any = null, filtro: any = null): Observable<ServerResponsePaginator> {
    const url = `${this.API_URL_PRIVATE}/sin-asignar/zonales/${zonaId}`;

    const headers = new HttpHeaders().append('pagination', 'true');
    let params = new HttpParams().append('page', page);

    if (dpaId != undefined) {
      params = params.append('dpaId', JSON.stringify(dpaId));
    }
    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponsePaginator>(url, {buscador, filtro}, {params, headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response;
      })
    );
  }

}
