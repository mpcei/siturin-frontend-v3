import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject,  Observable} from 'rxjs';
import {CreateUserDto, UpdateUserDto, UserModel} from '@models/auth';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CatalogueModel, PaginatorModel} from '@models/core';
import {ActividadModel, CatalogoModel, HabitacionModel, HabitacionTarifaModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class HabitacionesHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/habitaciones`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/habitaciones`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  actualizarTarifarioRack(tramiteId:number,payload: HabitacionTarifaModel[]): Observable<HabitacionTarifaModel[]> {
    const url = `${this.API_URL_PRIVATE}/tarifario-rack `;
    const headers = new HttpHeaders().append('origin','siturin2')
    return this.httpClient.put<ServerResponse>(url, {habitacionTarifas:payload,headers}).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  actualizarTarifarioRackInmediatoSiguiente(payload: HabitacionTarifaModel[]): Observable<HabitacionTarifaModel[]> {
    const url = `${this.API_URL_PRIVATE}/tarifario-rack-inmediato-siguiente`;
    const headers = new HttpHeaders().append('origin','siturin2')
    return this.httpClient.put<ServerResponse>(url, {habitacionTarifas:payload,headers}).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  obtenerTarifarioRack(tramiteid: number): Observable<HabitacionModel[]> {
    const url = `${this.API_URL_PRIVATE}/tarifario-rack/tramites/${tramiteid}`;
    const headers = new HttpHeaders().append('origin','siturin2')
    return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
      map(response => {
        return response.data;
      })
    );
  }
}
