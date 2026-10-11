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
export class TecnicoZonalHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/tecnico-zonales`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/tecnico-zonales`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  generarReporteTramitesPorUsuarioInternoXLSX(tecnicoId: number) {
    const url = `${this.API_URL_PRIVATE}/${tecnicoId}/asignaciones/reportes`;
    const params = new HttpParams().append('tipo', CoreEnum.XLSX);
    return this.httpClient.get(url, {params, responseType: 'blob' as 'json'}).subscribe(reporte => {
      this.coreService.descargarDocumentoXLSX(reporte, 'bandeja_tecnico_zonal_' + format(new Date(), 'yyyy_MM_dd HH_mm_ss'));
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

  generarReporteTramitesXLSX() {
    const url = `${this.API_URL_PRIVATE}/reporte-asignaciones`;
    const params = new HttpParams().append('tipo', CoreEnum.XLSX);
    this.coreService.showLoad();
    return this.httpClient.get(url, {params, responseType: 'blob' as 'json'}).subscribe(reporte => {
      this.coreService.descargarDocumentoXLSX(reporte, 'bandeja_tecnico_dac_' + format(new Date(), 'yyyy_MM_dd HH_mm_ss'));
      this.coreService.hideLoad();
    });
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

  obtenerTramitesNoAtendidosPorUsuarioInterno(usuarioInternoId: number,page: number = 0, buscador: any = null): Observable<ServerResponsePaginator> {
    const url = `${this.API_URL_PRIVATE}/no-atendidos/tecnico-zonal/${usuarioInternoId}`;

    const headers = new HttpHeaders().append('pagination', 'true');
    let params = new HttpParams().append('page', page).append('limit', 15);

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponsePaginator>(url, {buscador}, {params, headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response;
      })
    );
  }

  obtenerTramitesAtendidosPorUsuarioInterno(usuarioInternoId: number,page: number = 0, buscador: any = null): Observable<ServerResponsePaginator> {
    const url = `${this.API_URL_PRIVATE}/atendidos/tecnico-zonal/${usuarioInternoId}`;

    const headers = new HttpHeaders().append('pagination', 'true');
    let params = new HttpParams().append('page', page).append('limit', 20);

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponsePaginator>(url, {buscador}, {params, headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response;
      })
    );
  }
}
