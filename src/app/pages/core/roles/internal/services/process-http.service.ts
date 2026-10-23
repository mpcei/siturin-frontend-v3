import { HttpResponseInterface } from '@/pages/auth/interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProcceduresHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/internal`;

    getProcessList(page: number = 1, search: string | null = null): Observable<HttpResponseInterface> {
        let params = new HttpParams();

        params = params.set('page', page);
        params = params.set('limit', 10);

        if (search) {
            params = params.set('search', search);
        }

        return this._httpClient.get<HttpResponseInterface>(`${this._apiUrl}/process-list`, { params }).pipe(
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

    updateInspectionDate(processId: string, inspectionDate: string): Observable<any> {
        return this._httpClient.post(`${this._apiUrl}/process-date`, { id: processId, inspectionDate: inspectionDate });
    }
}
