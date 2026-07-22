import { InternalInspectionInterface } from './../interfaces/internal-inspection.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { CustomMessageService } from '@utils/services';
import { map } from 'rxjs';
import { AuthService } from '@/pages/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class InternalInspectionService {
    private readonly httpClient = inject(HttpClient);
    private readonly authService = inject(AuthService);
    private readonly apiUrl = `${environment.API_URL}/core/guide-technician`;
    private readonly customMessageService = inject(CustomMessageService);

    create(payload: InternalInspectionInterface) {
        const url = `${this.apiUrl}`;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                this.customMessageService.showSuccess({ summary: response.title, detail: response.message });

                return response.data;
            })
        );
    }

    findProcesses(page: string) {
        const url = `${this.apiUrl}/process-guides/processes`;

        const params = new HttpParams().set('page', page);

        return this.httpClient.get<HttpResponseInterface>(url, { params }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findProcess(processId: string) {
        const url = `${this.apiUrl}/process-guides/processes/${processId}`;

        const params = new HttpParams().set('rolCode', this.authService.role.code);
        return this.httpClient.get<HttpResponseInterface>(url, { params }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    review(payload: any) {
        const url = `${this.apiUrl}/process-guides/processes/review`;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
