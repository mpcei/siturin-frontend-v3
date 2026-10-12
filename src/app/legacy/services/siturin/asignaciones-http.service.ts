import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {PaginatorModel} from '@models/core';
import {AsignacionModel, TramiteModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class AsignacionesHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/asignaciones`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/asignaciones`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  obtenerAsignacionesPorTramite(tramiteId: number): Observable<AsignacionModel[]> {
    const url = `${this.API_URL_PRIVATE}/tramites/${tramiteId}`;
    const headers = new HttpHeaders().append('origin','siturin2');
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  obtenerAsignacionesPorTramiteTodos(tramiteId: number): Observable<AsignacionModel[]> {
    const url = `${this.API_URL_PRIVATE}/tramites/${tramiteId}/todos`;
    const headers = new HttpHeaders().append('origin','siturin2');
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  reasignarTramiteTecnicoZonal(tramiteId: number, usuarioInternoId: number, payload: AsignacionModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/tramites/${tramiteId}/usuarios-internos/${usuarioInternoId}/tecnico-zonal`;
    const headers = new HttpHeaders().append('origin','siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }
}
