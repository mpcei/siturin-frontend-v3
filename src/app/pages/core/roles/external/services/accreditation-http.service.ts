import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { CustomMessageService } from '@utils/services/custom-message.service';

@Injectable({
    providedIn: 'root'
})
export class AccreditationHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/planner/projects`;
    private readonly _customMessageService = inject(CustomMessageService);

    findAll(page = 1, search: string | null) {
        const url = `${this._apiUrl}`;

        let params = new HttpParams();

        params = params.set('page', page);

        if (search) {
            params = params.set('search', search);
        }

        return this._httpClient.get<HttpResponseInterface>(url, { params }).pipe(
            map((response) => {
                return response;
            })
        );
    }

    findOne(id: string) {
        const url = `${this._apiUrl}/${id}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                const data = response.data;

                const startedAt = data?.startedAt ? new Date(data.startedAt) : null;
                const endedAt = data?.endedAt ? new Date(data.endedAt) : null;

                return {
                    ...data,
                    startedAt,
                    endedAt
                };
            })
        );
    }

    findProjectsByUser(userId: string) {
        const url = `${this._apiUrl}/users/${userId}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    delete(id: string) {
        const url = `${this._apiUrl}/${id}`;

        return this._httpClient.delete<HttpResponseInterface>(url).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    findTechnicalFeasibilityDocuments(id: string) {
        const url = `${this._apiUrl}/${id}/technical-feasibility-documents`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findApprovalDocuments(id: string) {
        const url = `${this._apiUrl}/${id}/approval-documents`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findProgramDocuments(id: string) {
        const url = `${this._apiUrl}/${id}/program-documents`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
