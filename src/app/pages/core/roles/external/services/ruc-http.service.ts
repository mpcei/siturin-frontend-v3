import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { CustomMessageService } from '@utils/services/custom-message.service';

@Injectable({
    providedIn: 'root'
})
export class RucHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/external/rucs`;
    private readonly _customMessageService = inject(CustomMessageService);

    findEstablishmentsByRuc(page = 1, search: string | null, ruc: string) {
        const url = `${this._apiUrl}/${ruc}/establishments`;

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
}
