import { InternalInspectionInterface } from './../interfaces/internal-inspection.interface';
import { HttpClient } from '@angular/common/http';
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
    private readonly _apiUrl = `${environment.API_URL}/core/shared/processes/internal-inspections`;
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
}
