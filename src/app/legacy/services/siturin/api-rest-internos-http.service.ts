import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable, retry} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {PaginatorModel} from '@models/core';
import {CedulaDinardapModel, GuiaTurismoModel, RucDinardapModel, RucModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class ApiRestInternosHttpService {
  API_URL_INTERNO = `${environment.API_URL_INTERNO}`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  obtenerGuia(cedula: string): Observable<GuiaTurismoModel> {
    const url = `${this.API_URL_INTERNO}/siete/guia/${cedula}`;
    const headers = new HttpHeaders().append('origin','siturin2');
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
      retry(2),
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }
}
