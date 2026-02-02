import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RegulationSectionInterface } from '@modules/core/shared/interfaces';

@Injectable({
    providedIn: 'root'
})
export class RegulationHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/shared/regulations`;
    private readonly _customMessageService = inject(CustomMessageService);

    getRegulationsByModelId(modelId: string): Observable<RegulationSectionInterface[]> {
        const url = `${this._apiUrl}/sections/${modelId}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    getRegulationsAdventureTourismModalityByModelId(modelId: string): Observable<RegulationSectionInterface[]> {
        const url = `${this._apiUrl}/sections/${modelId}/adventure`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
