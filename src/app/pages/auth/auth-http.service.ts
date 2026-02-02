import { inject, Injectable } from '@angular/core';
import { HttpResponseInterface, PasswordChangedInterface, SignInInterface, UserInterface } from './interfaces';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '@modules/auth/auth.service';
import { SignInResponseInterface } from '@modules/auth/interfaces';
import { from, Observable, of } from 'rxjs';
import { CatalogueHttpService, CoreSessionStorageService, DpaHttpService } from '@utils/services';
import { CoreEnum } from '@utils/enums';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { CatalogueInterface } from '@utils/interfaces';

@Injectable({
    providedIn: 'root'
})
export class AuthHttpService {
    protected readonly catalogueHttpService = inject(CatalogueHttpService);
    private readonly authService = inject(AuthService);
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/auth`;
    private readonly dpaHttpService = inject(DpaHttpService);
    private readonly router = inject(Router);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);

    refreshToken() {
        const url = `${this.apiUrl}/refresh-token`;

        const headers = new HttpHeaders({ Authorization: this.authService.refreshToken! });

        return this.httpClient.post<SignInResponseInterface>(url, null, { headers }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    signIn(payload: SignInInterface) {
        const url = `${this.apiUrl}/sign-in`;

        return this.catalogueHttpService.findCache().pipe(
            // 1. Obtiene catálogos y ESPERA a que se guarden en storage
            switchMap((catalogues) =>
                from(this.coreSessionStorageService.setEncryptedValue(CoreEnum.catalogues, catalogues)).pipe(
                    map(() => catalogues) // Retornamos el valor para seguir la cadena (opcional, pero buena práctica)
                )
            ),
            // 2. Una vez guardado lo anterior, ejecuta DPA
            switchMap(() => this.dpaHttpService.findCache()),

            // 3. Obtiene DPA y ESPERA a que se guarde en storage
            switchMap((dpa) => from(this.coreSessionStorageService.setEncryptedValue(CoreEnum.dpa, dpa)).pipe(map(() => dpa))),

            // 4. Finalmente, hace el login
            switchMap(() => this.httpClient.post<SignInResponseInterface>(url, payload)),

            // 5. Procesa la respuesta del login
            map((response) => {
                const { data } = response;
                this.authService.accessToken = data.accessToken;
                this.authService.refreshToken = data.refreshToken;
                this.authService.auth = data.auth;
                this.authService.roles = data.roles;

                if (data.roles.length === 1) {
                    this.authService.role = data.roles[0];
                }

                return data;
            })
        );

        // return this.httpClient.post<SignInResponseInterface>(url, payload).pipe(
        //     map((response) => {
        //         this.authService.accessToken = response.data.accessToken;
        //
        //         this.authService.auth = response.data.auth;
        //
        //         this.authService.roles = response.data.roles;
        //
        //         if (response.data.roles.length === 1) {
        //             this.authService.role = response.data.roles[0];
        //         }
        //
        //         return response.data;
        //     })
        // );
    }

    signOut() {
        if (!this.authService.accessToken) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate([MY_ROUTES.authPages.signIn.absolute]);
            return of();
        }

        const url = `${this.apiUrl}/sign-out`;

        return this.httpClient.post<SignInResponseInterface>(url, null).pipe(
            map((response) => {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate([MY_ROUTES.authPages.signIn.absolute]);
                return response.data;
            })
        );
    }

    changePassword(payload: PasswordChangedInterface): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/passwords`;

        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    resetPassword(username: string, password: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/passwords/${username}/reset`;

        return this.httpClient.patch<HttpResponseInterface>(url, { username, password }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    signUpExternal(payload: SignInInterface) {
        const url = `${this.apiUrl}/sign-up-external`;

        return this.httpClient.post<SignInResponseInterface>(url, payload).pipe(
            map((response) => {
                return response;
            })
        );
    }

    requestTransactionalCode(): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes`;

        return this.httpClient.post<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    requestTransactionalSignupCode(identification: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes/${identification}/signup`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    requestTransactionalPasswordResetCode(identification: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes/${identification}/password-reset`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyTransactionalCode(token: string, requester: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes/${token}/verify`;
        return this.httpClient.patch<HttpResponseInterface>(url, { requester }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyUserExist(identification: string) {
        const url = `${this.apiUrl}/${identification}/exist`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyUserUpdated(identification: string, userId = '') {
        const url = `${this.apiUrl}/${identification}/updated`;

        const params = new HttpParams().append('userId', userId);

        return this.httpClient.get<HttpResponseInterface>(url, { params }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyRegisteredUser(identification: string) {
        const url = `${this.apiUrl}/${identification}/registered`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifySecurityQuestionsAndResetEmail(userId: string, payload: any): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/${userId}/security-questions/verify`;

        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyRucPendingPayment(ruc: string) {
        const url = `${this.apiUrl}/verify-ruc-pending-payment/${ruc}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findSecurityQuestions(): Observable<CatalogueInterface> {
        const url = `${this.apiUrl}/security-questions`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createSecurityQuestions(payload: CatalogueInterface): Observable<UserInterface> {
        const url = `${this.apiUrl}/security-questions`;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyEmail(token: string) {
        const url = `${this.apiUrl}/verify-email`;

        return this.httpClient.post<HttpResponseInterface>(url, { token }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    requestVerifyEmail(username: string) {
        const url = `${this.apiUrl}/request-verify-email`;

        return this.httpClient.post<HttpResponseInterface>(url, { username }).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    acceptTermsConditions() {
        const url = `${this.apiUrl}/terms-conditions/accept`;

        return this.httpClient.patch<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                this.authService.auth = { ...this.authService.auth, termsConditions: true };
                return response.data;
            })
        );
    }

    rejectTermsConditions() {
        const url = `${this.apiUrl}/terms-conditions/reject`;

        return this.httpClient.patch<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
