import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CreateUserDto, RoleModel, UpdateUserDto, UserModel} from '@models/auth';
import {PaginatorModel} from "@models/core";
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';

@Injectable({
  providedIn: 'root'
})
export class UsersHttpService {
  API_URL = `${environment.API_URL_PRIVATE}/users`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(
    private coreService: CoreService,
    private httpClient: HttpClient,
    private messageService: MessageService,
  ) {
  }

  create(payload: CreateUserDto): Observable<UserModel> {
    const url = `${this.API_URL}`;
    const headers = new HttpHeaders().append('origin','siturin2');

    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload,{headers}).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  findAll(page: number = 0, search: string = ''): Observable<UserModel[]> {
    const url = this.API_URL;

    const headers = new HttpHeaders().append('pagination', 'true').append('origin','siturin2');
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

  findOne(id: string): Observable<UserModel> {
    const url = `${this.API_URL}/${id}`;
    const headers = new HttpHeaders().append('origin','siturin2');

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  update(id: string, payload: UpdateUserDto): Observable<UserModel> {
    const url = `${this.API_URL}/${id}`;
    const headers = new HttpHeaders().append('origin','siturin2');

    this.coreService.showLoad();
    return this.httpClient.put<ServerResponse>(url, payload,{headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  reactivate(id: string): Observable<UserModel> {
    const url = `${this.API_URL}/${id}/reactivate`;
    const headers = new HttpHeaders().append('origin','siturin2');

    this.coreService.showLoad();
    return this.httpClient.put<ServerResponse>(url, null,{headers}).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  remove(id: string): Observable<UserModel> {
    const url = `${this.API_URL}/${id}`;
    const headers = new HttpHeaders().append('origin','siturin2');

    this.coreService.showLoad();
    return this.httpClient.delete<ServerResponse>(url,{headers}).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  removeAll(users: UserModel[]): Observable<UserModel[]> {
    const url = `${this.API_URL}/remove-all`;
    const headers = new HttpHeaders().append('origin','siturin2');

    this.coreService.showLoad();
    return this.httpClient.patch<ServerResponse>(url, users,{headers}).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  suspend(id: string): Observable<UserModel> {
    const url = `${this.API_URL}/${id}/suspend`;
    const headers = new HttpHeaders().append('origin','siturin2');

    this.coreService.showLoad();
    return this.httpClient.put<ServerResponse>(url, null,{headers}).pipe(
      map((response) => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }
}
