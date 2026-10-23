import { HttpResponseInterface } from '@/pages/auth/interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InternalHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/internal`;

    getInternalUsersList(page: number = 1, search: string | null = null): Observable<HttpResponseInterface> {
        let params = new HttpParams();

        params = params.set('page', page);
        params = params.set('limit', 10);

        if (search) {
            params = params.set('search', search);
        }

        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/user-list`, { params }).pipe(
            map((response) => {
                return response;
            })
        );
    }
    getDpasByInternalUserId(internalUserId: string): Observable<HttpResponseInterface> {
        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/${internalUserId}/dpa-internal`).pipe(
            map((response) => {
                return response;
            })
        );
    }

    assignDpa(internalUserId: string, dpaId: string): Observable<any> {
        return this._httpClient.post(`${this._apiUrl}/add-dpa`, { internalUserId,dpaId });
    }

    removeDpa( dpaId: string): Observable<any> {
        return this._httpClient.delete(`${this._apiUrl}/${dpaId}/delete-dpa`);
    }
    availableInternalUser(internalUserId: string, isAvailable: boolean): Observable<any> {
        return this._httpClient.post(`${this._apiUrl}/available`, { id: internalUserId, isAvailable: isAvailable });
    }
    enabledDpaInternalUser(internalUserId: string, enabled: boolean): Observable<any> {
        return this._httpClient.post(`${this._apiUrl}/enabled-dpa`, { id: internalUserId, enabled: enabled });
    }
    createInternalUser(userId: string) {
        return this._httpClient.post(`${this._apiUrl}/register-internal-user`, { userId }).pipe(
            map((response) => {
                return response;
            })
        );
    }
}
