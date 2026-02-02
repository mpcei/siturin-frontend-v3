import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProcessHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/shared/processes`;
    private readonly _customMessageService = inject(CustomMessageService);

    createStep1(payload: any) {
        const url = `${this._apiUrl}/step1`;

        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createStep2(payload: any) {
        const url = `${this._apiUrl}/step2`;

        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createFilesInspectionStatus(modelId: string, payload: FormData, folder: string): Observable<HttpResponseInterface> {
        const url = `${this._apiUrl}/inspection-status/uploads`;

        const params = new HttpParams().append('modelId', modelId).append('folder', folder);

        return this._httpClient.post<HttpResponseInterface>(url, payload, { params }).pipe(
            map((response) => {
                return response;
            })
        );
    }
}
