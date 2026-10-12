import {Injectable} from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject,  Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {PaginatorModel} from '@models/core';
import {EstablecimientoModel, RucDinardapModel, RucModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientosHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/establecimientos`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/establecimientos`;

  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  obtenerEstablecimientosPorRuc(ruc: string): Observable<EstablecimientoModel[]> {
    const url = `${this.API_URL_PRIVATE}/rucs/${ruc}`;
    const headers = new HttpHeaders().append('origin','siturin2')
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  obtenerEstablecimientoPorTramite(establecimientoId: number): Observable<EstablecimientoModel> {
    const url = `${this.API_URL_PRIVATE}/${establecimientoId}/tramites`;
    const headers = new HttpHeaders().append('origin','siturin2')
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  guardarFase1(establecimiento: EstablecimientoModel): Observable<EstablecimientoModel> {
    const url = `${this.API_URL_PRIVATE}`;
    const headers = new HttpHeaders().append('origin','siturin2')
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, establecimiento,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  actualizarEstablecimientosDinardap(ruc: RucDinardapModel): Observable<EstablecimientoModel> {
    const url = `${this.API_URL_PRIVATE}/dinardap`;
    const headers = new HttpHeaders().append('origin','siturin2')
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, ruc,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }
}
