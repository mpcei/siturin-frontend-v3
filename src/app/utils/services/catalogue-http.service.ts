import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CatalogueInterface } from '@utils/interfaces';

@Injectable({
    providedIn: 'root'
})
export class CatalogueHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/common/catalogues`;
    private readonly _customMessageService = inject(CustomMessageService);

    findCache(): Observable<HttpResponseInterface> {
        const url = `${this._apiUrl}/cache`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findCataloguesByModel(modelId: string): Observable<CatalogueInterface[]> {
        const url = `${this._apiUrl}/model-catalogues/${modelId}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
