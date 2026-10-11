import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CreateMenuDto, MenuModel, UpdateMenuDto} from '@models/auth';
import {PaginatorModel} from "@models/core";
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {AuthService} from '@services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MenusHttpService {
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/menus`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(
    private authService: AuthService,
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create(payload: CreateMenuDto): Observable<MenuModel> {
    const url = `${this.API_URL_PRIVATE}`;

    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  catalogue(): Observable<MenuModel[]> {
    const url = `${this.API_URL_PRIVATE}/catalogue`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  getMenusForSidebar(): Observable<MenuModel[]> {
    const url = `${this.API_URL_PRIVATE}/roles/${this.authService.role.id}/sidebar`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  findAll(page: number = 0, search: string = ''): Observable<MenuModel[]> {
    const url = this.API_URL_PRIVATE;

    const headers = new HttpHeaders().append('pagination', 'true');
    const params = new HttpParams()
      .append('page', page)
      .append('search', search);

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map((response) => {
        this.coreService.hideLoad();
        if (response.pagination) {
          this.pagination.next(response.pagination);
        }
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<MenuModel> {
    const url = `${this.API_URL_PRIVATE}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateMenuDto): Observable<MenuModel> {
    const url = `${this.API_URL_PRIVATE}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  remove(id: string): Observable<MenuModel> {
    const url = `${this.API_URL_PRIVATE}/${id}`;

    this.coreService.showLoad();
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  removeAll(menus: MenuModel[]): Observable<MenuModel[]> {
    const url = `${this.API_URL_PRIVATE}/remove-all`;

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, menus).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }
}
