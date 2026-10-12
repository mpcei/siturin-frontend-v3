import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {PaginatorModel} from '@models/core';
import {AsignacionModel, InspeccionModel, TramiteModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class InspeccionesHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/inspecciones`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/inspecciones`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  obtenerInspeccionesPorTramiteTodos(tramiteId: number): Observable<InspeccionModel[]> {
    const url = `${this.API_URL_PRIVATE}/tramites/${tramiteId}/todos`;
    const headers = new HttpHeaders().append('origin','siturin2')
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }
}
