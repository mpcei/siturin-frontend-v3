import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {CreateUserDto, UpdateUserDto, UserModel} from '@models/auth';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CatalogueModel, PaginatorModel} from '@models/core';
import {CatalogoModel, ClasificacionModel, ConfiguracionCategoriaModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class ClasificacionesHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/clasificaciones`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/clasificaciones`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  create(payload: CreateUserDto): Observable<UserModel> {
    const url = `${this.API_URL_PUBLIC}`;
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  obtenerClasificacionesPorActividad(actividadId: number): Observable<ClasificacionModel[]> {
    const url = `${this.API_URL_PUBLIC}/actividades/${actividadId}`;
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  obtenerClasificacionesParaServiciosComplementarios(codigoActividad: string): Observable<ClasificacionModel[]> {
    const url = `${this.API_URL_PRIVATE}/servicios-complementarios`;
    const params = new HttpParams().append('codigoActividad', codigoActividad);
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {params}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  obtenerConfiguracionCategoriasPorClasificacion(clasificacionId: number): Observable<ConfiguracionCategoriaModel[]> {
    const url = `${this.API_URL_PUBLIC}/${clasificacionId}/configuracion-categorias`;
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  obtenerCatalogosHijos(padreId: number): Observable<CatalogoModel[]> {
    const url = `${this.API_URL_PUBLIC}/hijos`;
    const params = new HttpParams().append('padreid', padreId);
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {params}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  findAll(page: number = 1, search: string = ''): Observable<CatalogueModel[]> {
    const url = this.API_URL_PUBLIC;
    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams().append('page', page).append('search', search);
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map(response => {
        this.coreService.hideLoad();
        if (response.pagination) {
          this.pagination.next(response.pagination);
        }
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<UserModel> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => response.data)
    );
  }

  update(id: string, payload: UpdateUserDto): Observable<UserModel> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<boolean> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(id: CatalogueModel[]): Observable<boolean> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }
}
