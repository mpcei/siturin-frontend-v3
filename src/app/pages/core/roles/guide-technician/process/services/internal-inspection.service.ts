import { InternalInspectionInterface } from './../interfaces/internal-inspection.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { CustomMessageService } from '@utils/services';
import { map } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class InternalInspectionService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/guide-technician`;
    private readonly _customMessageService = inject(CustomMessageService);

    create(payload: InternalInspectionInterface) {
        const url = `${this._apiUrl}`;

        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    findProcesses(page: string) {
        const url = `${this._apiUrl}/process-guides/processes`;

        const params = new HttpParams().set('page', page);
        return this._httpClient.get<HttpResponseInterface>(url, { params }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findProcess(processId: string) {
        const url = `${this._apiUrl}/process-guides/processes/${processId}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    review(processId: string, payload: any) {
        const url = `${this._apiUrl}/process-guides/processes`;

        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
