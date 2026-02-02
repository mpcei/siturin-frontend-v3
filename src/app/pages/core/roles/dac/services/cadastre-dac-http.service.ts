import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { ParkInterface } from '@modules/core/interfaces';
import { CustomMessageService } from '@utils/services';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CadastreDacHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/dac/cadastres`;
    private readonly _customMessageService = inject(CustomMessageService);

    getCadastres(page: number = 1, search: string = ''): Observable<HttpResponseInterface> {
        let params = new HttpParams().set('page', page.toString());

        if (search) {
            params = params.append('search', search);
        }

        return this._httpClient.get<HttpResponseInterface>(this._apiUrl, { params }).pipe(
            map((response) => {
                return response;
            })
        );
    }
}
