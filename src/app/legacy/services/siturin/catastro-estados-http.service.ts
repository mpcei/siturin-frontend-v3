import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {PaginatorModel} from '@models/core';
import {CatastroEstadoModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class CatastroEstadosHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/catastro-estados`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/catastro-estados`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  obtenerCatastroEstados(): Observable<CatastroEstadoModel[]> {
    const url = `${this.API_URL_PRIVATE}`;
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }
}
