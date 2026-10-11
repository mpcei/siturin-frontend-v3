import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {UpdateUserDto, UserModel} from '@models/auth';
import {map} from 'rxjs/operators';
import {ServerResponse, ServerResponsePaginator} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CatalogueModel, FileModel, PaginatorModel} from '@models/core';
import {
  AsignacionModel,
  CatalogoModel, CatastroModel,
  DpaModel,
  EstablecimientoModel,
  InspeccionModel,
  TramiteModel
} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class CtcHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/ctc`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/ctc`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  guardarTramiteContinente(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/catastros-continente`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteGalapagos(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/catastros-galapagos`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }
}
