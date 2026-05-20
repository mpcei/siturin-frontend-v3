import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { HttpResponseInterface, UpdateUserDto } from '@/pages/auth/interfaces';

@Injectable({
    providedIn: 'root'
})
export class UserHttpService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/auth/users`;

    findAll(page: number = 1, search: string = '') {
        let params = new HttpParams().set('page', page.toString());

        if (search) {
            params = params.append('search', search);
        }

        return this.httpClient.get<HttpResponseInterface>(this.apiUrl, { params }).pipe(
            map((response) => {
                return response;
            })
        );
    }

    findOne(id: string) {
        return this.httpClient.get<HttpResponseInterface>(`${this.apiUrl}/${id}`).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    create(payload: UpdateUserDto) {
        return this.httpClient.post<HttpResponseInterface>(`${this.apiUrl}`, payload);
    }

    update(id: string, payload: UpdateUserDto) {
        return this.httpClient.patch<HttpResponseInterface>(`${this.apiUrl}/${id}`, payload);
    }

    delete(id: string) {
        return this.httpClient.delete<HttpResponseInterface>(`${this.apiUrl}/${id}`);
    }

    suspend(id: string) {
        return this.httpClient.patch<HttpResponseInterface>(`${this.apiUrl}/${id}/suspend`, null);
    }

    activate(id: string) {
        return this.httpClient.patch<HttpResponseInterface>(`${this.apiUrl}/${id}/activate`, null);
    }

    updateProfile(id: string, payload: UpdateUserDto) {
        return this.httpClient.patch<HttpResponseInterface>(`${this.apiUrl}/${id}/profile`, payload);
    }

    updateAdditionalInformation(id: string, payload: UpdateUserDto) {
        return this.httpClient.patch<HttpResponseInterface>(`${this.apiUrl}/${id}/additional-information`, payload);
    }

    updateAvatar(id: string, file: File) {
        const form = new FormData();
        form.append('avatar', file);

        return this.httpClient.post<HttpResponseInterface>(`${this.apiUrl}/${id}/avatar`, form).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findProfile(id: string) {
        return this.httpClient.get<HttpResponseInterface>(`${this.apiUrl}/${id}/profile`).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
