import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CategoryConfigurationInterface } from '../interfaces/category-configuration.interface';

@Injectable({
    providedIn: 'root'
})
export class CategoryConfigurationsHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/shared/category-configurations`;

    findByClassificationId(classificationId: string): Observable<CategoryConfigurationInterface[]> {
        const url = `${this._apiUrl}/${classificationId}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
