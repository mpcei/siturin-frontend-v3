import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable, retry} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {PaginatorModel} from '@models/core';
import {CedulaDinardapModel, RucDinardapModel, RucModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class DinardapHttpService {
  API_URL_DINARDAP = `${environment.API_URL_DINARDAP}/dinardap`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  obtenerRuc(ruc: string): Observable<RucDinardapModel> {
    const url = `${this.API_URL_DINARDAP}/sri/${ruc}`;
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      retry(2),
      map(response => {
        this.coreService.hideLoad();
        localStorage.setItem('ruc', JSON.stringify(response.data));
        return response.data;
      })
    );
  }

  obtenerExpediente(ruc: string): Observable<any> {
    const url = `${this.API_URL_DINARDAP}/supercias/${ruc}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      retry(2),
      map(response => {
        this.coreService.hideLoad();
        localStorage.setItem('expedienteSuperciesE', JSON.stringify(response));
        return response.data;
      })
    );
  }

  obtenerRegistroCivil(cedula: string): Observable<CedulaDinardapModel> {
    const url = `${this.API_URL_DINARDAP}/registro-civil/${cedula}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      retry(2),
      map(response => {
        this.coreService.hideLoad();
        localStorage.setItem('expedienteSuperciesE', JSON.stringify(response));
        return response.data;
      })
    );
  }
}
