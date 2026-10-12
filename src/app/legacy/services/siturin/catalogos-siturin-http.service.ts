import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {CreateUserDto, UpdateUserDto, UserModel} from '@models/auth';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CatalogueModel, PaginatorModel} from '@models/core';
import {CatalogoSiturinTipoEnum} from '@shared/enums';
import {CatalogoModel} from '@models/siturin';
import {CatalogosSiturinService} from '@services/siturin/catalogos-siturin.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogosSiturinHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/catalogos-siturin`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService) {
  }

  obtenerCatalogos(): Observable<CatalogoModel[]> {
    const url = `${this.API_URL_PUBLIC}`;
    const headers = new HttpHeaders().append('origin','siturin2');
    return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  obtenerCatalogosPorClasificacion(clasificacionId: number, tipo: CatalogoSiturinTipoEnum): Observable<CatalogoModel[]> {
    const url = `${this.API_URL_PUBLIC}/clasificaciones/${clasificacionId}`;
    const headers = new HttpHeaders().append('origin','siturin2');
    const params = new HttpParams().append('tipo', tipo);

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {params,headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }
}
