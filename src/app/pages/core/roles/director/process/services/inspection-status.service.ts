import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { CustomMessageService } from '@utils/services';
import { map } from 'rxjs';
import {
    CreateRatifiedInspectionStateInterface,
    DefinitiveSuspensionInspectionStatusInterface,
    InactivationInspectionStatusInterface,
    RecategorizedInspectionStatusInterface,
    ReclassifiedInspectionStatusInterface,
    TemporarySuspensionInspectionStatusInterface
} from '../interfaces/inspection-state.interface';

@Injectable({
    providedIn: 'root'
})
export class InspectionStatusService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/shared/cadastres/inspections`;
    private readonly _customMessageService = inject(CustomMessageService);

    createRatifiedInspectionState(payload: CreateRatifiedInspectionStateInterface) {
        const url = `${this._apiUrl}/registration-status`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    createInactivationInspectionStatus(payload: InactivationInspectionStatusInterface) {
        const url = `${this._apiUrl}/inactivation-status`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    createTemporarySuspensionInspectionStatus(payload: TemporarySuspensionInspectionStatusInterface) {
        const url = `${this._apiUrl}/temporary-suspension-status`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    createDefinitiveSuspensionInspectionStatus(payload: DefinitiveSuspensionInspectionStatusInterface) {
        const url = `${this._apiUrl}/definitive-suspension-status`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    createRecategorizedInspectionStatus(payload: RecategorizedInspectionStatusInterface) {
        const url = `${this._apiUrl}/recategorized-status`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    createReclassifiedInspectionStatus(payload: ReclassifiedInspectionStatusInterface) {
        const url = `${this._apiUrl}/reclassified-status`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                this._customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }
}
