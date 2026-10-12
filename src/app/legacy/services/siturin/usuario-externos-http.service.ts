import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {CreateUserDto, UpdateUserDto, UserModel} from '@models/auth';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CatalogueModel, PaginatorModel} from '@models/core';
import {ActividadModel, CatalogoModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class UsuarioExternosHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/usuario-externos`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/usuario-externos`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  aceptarTerminosCondiciones(usuarioExternoId: number): Observable<UserModel> {
    const url = `${this.API_URL_PRIVATE}/${usuarioExternoId}/terminos-condiciones`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    return this.httpClient.get<ServerResponse>(url, {headers}).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }
}
