import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GuideHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/external/process-guides`;
    private readonly _customMessageService = inject(CustomMessageService);

    createRegistration(payload: FormData): Observable<any> {
        const url = `${this._apiUrl}/registrations`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
