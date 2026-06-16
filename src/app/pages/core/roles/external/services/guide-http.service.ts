import { inject, Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { HttpResponseInterface } from '@modules/auth/interfaces';
import { Observable } from 'rxjs';
import { CatalogueActivitiesGeographicAreaEnum, CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';

@Injectable({
    providedIn: 'root'
})
export class GuideHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/core/external/process-guides`;
    private readonly apiUrlSharedCore = `${environment.API_URL}/core/shared/guides`;
    private readonly catalogueService = inject(CatalogueService);

    createRegistration(payload: FormData): Observable<any> {
        const url = `${this._apiUrl}/registrations`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createCurrentRegistration(payload: FormData): Observable<any> {
        const url = `${this._apiUrl}/current-registrations`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createExpiredRegistration(payload: FormData): Observable<any> {
        const url = `${this._apiUrl}/expired-registrations`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createRenew(payload: FormData): Observable<any> {
        const url = `${this._apiUrl}/renewval-registrations`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createReadmission(payload: FormData): Observable<any> {
        const url = `${this._apiUrl}/readmissions`;
        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    async validateDegreeType(degrees: any[], geographicAreaCode: string): Promise<any | null> {
        if (degrees.length > 0) {
            const relatedDegrees = await this.catalogueService.findByType(CatalogueTypeEnum.related_degrees);

            if (degrees.every((item) => item.levelCode === 'bachiller')) {
                return {
                    degree: degrees[0],
                    type: 'bachiller'
                };
            }

            const normalize = (text: string) =>
                text
                    .normalize('NFD') // separa letras y tildes
                    .replace(/[\u0300-\u036f]/g, '') // elimina tildes
                    .toLowerCase();

            const thirdLevelDegrees = degrees.filter((item) => item.levelCode === 'tercer_nivel');

            let guideTourismDegrees = [];

            switch (geographicAreaCode) {
                case CatalogueActivitiesGeographicAreaEnum.continent:
                    guideTourismDegrees = thirdLevelDegrees.filter((item) => normalize(item.name).includes('guia'));
                    break;

                case CatalogueActivitiesGeographicAreaEnum.galapagos:
                    guideTourismDegrees = thirdLevelDegrees.filter((item) => ['guia', 'turismo'].some((word) => normalize(item.name).includes(word)));
                    break;
            }

            if (guideTourismDegrees.length > 0) {
                return {
                    degree: guideTourismDegrees[0],
                    type: 'guide'
                };
            }

            if (thirdLevelDegrees.length === 0) {
                return {
                    degree: degrees[0],
                    type: 'bachiller'
                };
            }

            const hasMatch = thirdLevelDegrees.some((t1) => relatedDegrees.some((t2) => normalize(t1.name) === normalize(t2.name!)));

            if (hasMatch) {
                return {
                    degree: thirdLevelDegrees[0],
                    type: 'related'
                };
            }

            return {
                degree: degrees[0],
                type: 'bachiller'
            };
        }

        return {
            degree: null,
            type: null
        };
    }

    findProfessionalTitlesByEstablishmentId(establishmentId: string) {
        const url = `${this.apiUrlSharedCore}/professional-titles/${establishmentId}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createProfessionalTitles(ruc: string, establishmentId: string) {
        const url = `${this.apiUrlSharedCore}/professional-titles`;

        return this._httpClient.post<HttpResponseInterface>(url, { ruc, establishmentId }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    updateGuideInformation(ruc: string) {
        const url = `${this.apiUrlSharedCore}/registro-civil/${ruc}`;

        return this._httpClient.patch<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findGuidesSiete(ruc: string): Observable<any[]> {
        const url = `${this.apiUrlSharedCore}/${ruc}`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findRequirementConfigurations(classificationId: string, professionalTitleCode: string): Observable<any[]> {
        const url = `${this.apiUrlSharedCore}/requirement-configurations`;

        const params = new HttpParams().append('classificationId', classificationId).append('professionalTypeCode', professionalTitleCode);
        return this._httpClient.get<HttpResponseInterface>(url, { params }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createInactivation(payload: any): Observable<any> {
        const url = `${this._apiUrl}/processes/inactivated`;

        return this._httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
