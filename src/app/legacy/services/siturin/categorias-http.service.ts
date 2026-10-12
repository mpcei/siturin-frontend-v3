import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateUserDto, UpdateUserDto, UserModel } from '@models/auth';
import { map } from 'rxjs/operators';
import { ServerResponse } from '@models/http-response';
import { CoreService, MessageService } from '@services/core';
import { CatalogueModel, PaginatorModel } from '@models/core';
import { CatalogoModel, CategoriaModel } from '@models/siturin';

@Injectable({
    providedIn: 'root'
})
export class CategoriasHttpService {
    API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/categorias`;
    API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/categorias`;
    private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
    public pagination$ = this.pagination.asObservable();

    constructor(
        private httpClient: HttpClient,
        private coreService: CoreService,
        private messageService: MessageService
    ) {}

    create(payload: CreateUserDto): Observable<UserModel> {
        const url = `${this.API_URL_PUBLIC}`;
        const headers = new HttpHeaders().append('origin', 'siturin2');

        return this.httpClient.post<ServerResponse>(url, payload,{headers}).pipe(
            map((response) => {
                this.messageService.success(response);
                return response.data;
            })
        );
    }

    obtenerCategoriasPorClasificacion(clasificacionId: number): Observable<CategoriaModel[]> {
        const url = `${this.API_URL_PUBLIC}/clasificaciones/${clasificacionId}`;
        const headers = new HttpHeaders().append('origin','siturin2');

        this.coreService.showLoad();
        return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
            map((response) => {
                this.coreService.hideLoad();
                return response.data;
            })
        );
    }

    obtenerTipoHabitacionesPorCategoria(categoriaId: number): Observable<CatalogoModel[]> {
        const url = `${this.API_URL_PRIVATE}/${categoriaId}/tipo-habitaciones`;
                const headers = new HttpHeaders().append('origin','siturin2');

        this.coreService.showLoad();
        return this.httpClient.get<ServerResponse>(url,{headers}).pipe(
            map((response) => {
                this.coreService.hideLoad();
                return response.data;
            })
        );
    }

    obtenerCatalogosHijos(padreId: number): Observable<CatalogoModel[]> {
        const url = `${this.API_URL_PUBLIC}/hijos`;
        const headers = new HttpHeaders().append('origin','siturin2');

        const params = new HttpParams().append('padreid', padreId);
        this.coreService.showLoad();
        return this.httpClient.get<ServerResponse>(url, { params ,headers}).pipe(
            map((response) => {
                this.coreService.hideLoad();
                return response.data;
            })
        );
    }

    findAll(page: number = 1, search: string = ''): Observable<CatalogueModel[]> {
        const url = this.API_URL_PUBLIC;;
        const headers = new HttpHeaders().append('pagination', 'true').append('origin','siturin2');
        const params = new HttpParams().append('page', page).append('search', search);
        this.coreService.showLoad();
        return this.httpClient.get<ServerResponse>(url, { headers, params }).pipe(
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
        const url = `${this.API_URL_PUBLIC}/${id}`;
        const headers = new HttpHeaders().append('origin','siturin2')
        return this.httpClient.get<ServerResponse>(url,{headers}).pipe(map((response) => response.data));
    }

    update(id: string, payload: UpdateUserDto): Observable<UserModel> {
        const url = `${this.API_URL_PUBLIC}/${id}`;
        const headers = new HttpHeaders().append('origin','siturin2')
        return this.httpClient.put<ServerResponse>(url, payload,{headers}).pipe(
            map((response) => {
                this.messageService.success(response);
                return response.data;
            })
        );
    }

    remove(id: string): Observable<boolean> {
        const url = `${this.API_URL_PUBLIC}/${id}`;
        const headers = new HttpHeaders().append('origin','siturin2')
        return this.httpClient.delete<ServerResponse>(url,{headers}).pipe(
            map((response) => {
                this.messageService.success(response);
                return response.data;
            })
        );
    }

    removeAll(id: CatalogueModel[]): Observable<boolean> {
        const url = `${this.API_URL_PUBLIC}/${id}`;
        const headers = new HttpHeaders().append('origin','siturin2')
        return this.httpClient.delete<ServerResponse>(url,{headers}).pipe(
            map((response) => {
                this.messageService.success(response);
                return response.data;
            })
        );
    }
}
