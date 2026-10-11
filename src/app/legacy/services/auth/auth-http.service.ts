import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from '@env/environment';
import {LoginModel, PasswordChangeModel, PasswordResetModel, RoleModel, UpdateUserDto, UserModel} from '@models/auth';
import {LoginResponse, ServerResponse} from '@models/http-response';
import {AuthService} from '@services/auth';
import {CoreService, MessageService} from '@services/core';
// import {AuthRoutesEnum, RoutesEnum} from "@shared/enums";
import {RoutesService} from "@services/core/routes.service";
import {RolePipe} from "@shared/pipes";
import {CatalogosSiturinService, DinardapHttpService, DpaHttpService, DpaService} from '@services/siturin';
import {ValidationQuestionModel} from "@models/auth/validation-question.model";

@Injectable({
  providedIn: 'root'
})

export class AuthHttpService {
  API_URL_PUBLIC: string = `${environment.API_URL_PUBLIC}/auth`;
  API_URL_PRIVATE: string = `${environment.API_URL_PRIVATE}/auth`;
  rolePipe: RolePipe = new RolePipe();

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private coreService: CoreService,
              private dpaService: DpaService,
              private catalogosSiturinService: CatalogosSiturinService,
              private dinardapHttpService: DinardapHttpService,
              private router: Router,
              private routesService: RoutesService,
              private messageService: MessageService) {
  }

  changePassword(credentials: PasswordChangeModel): Observable<ServerResponse> {
    const url = `${this.API_URL_PRIVATE}/change-password`;
    this.coreService.showLoad();
    return this.httpClient.put<ServerResponse>(url, credentials)
      .pipe(
        map(response => {
          this.coreService.hideLoad();
          this.messageService.success(response).then();
          return response.data;
        })
      );
  }

  requestTransactionalCodeRegister(credentials: any): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/request-transactional-code-register`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, credentials)
      .pipe(
        map(response => {
          this.coreService.hideLoad();
          this.messageService.success(response).then();
          return response.data;
        })
      );
  }

  requestTransactionalCodePasswordReset(credentials: any): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/request-transactional-code-password-reset`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, credentials)
      .pipe(
        map(response => {
          this.coreService.hideLoad();
          this.messageService.success(response).then();
          return response.data;
        })
      );
  }

  registerExternalUser(credentials: any): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/register-external-user`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, credentials)
      .pipe(
        map(response => {
          this.coreService.hideLoad();
          this.messageService.success(response).then();
          return response.data;
        })
      );
  }

  login(credentials: LoginModel): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/login`;

    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, credentials)
      .pipe(
        map(response => {
          this.coreService.hideLoad();
          this.authService.isLoggedIn = true;
          this.authService.token = response.token;
          this.authService.auth = response.data.user;
          this.authService.usuarioInterno = response.data.usuarioInterno;
          this.authService.usuarioExterno = response.data.usuarioExterno;
          this.authService.roles = response.data.roles;
          this.authService.permissions = response.data.permissions;
          this.authService.zonales = response.data.usuarioInterno?.zonales;
          // this.authService.dpa = response.data.usuarioInterno?.dpa;
          // this.messageService.success(response).then();
          this.dpaService.verificarDpa();
          this.catalogosSiturinService.verificarCatalogos();
          this.getDinardapRuc(response.data.user.identification);
          this.authService.role = response.data.roles[0];
          return response;
        })
      );
  }

  validateUser(credentials: LoginModel) {
    const url = `${this.API_URL_PUBLIC}/validate-user/${credentials.username}`;
    return this.httpClient.post<ServerResponse>(url, credentials).pipe(
      map((response: ServerResponse) => {
        return response.data;
      })
    );
  }

  loginMongoTemp(credentials: LoginModel) {
    return this.httpClient.post('https://mintur-siturin-back.turismo.gob.ec:5070/login', {
      email: credentials.username,
      password: credentials.password
    });
  }

  loginMongo(credentials: LoginModel): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/login-mongo`;

    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, credentials)
      .pipe(
        map(response => {
          this.coreService.hideLoad();
          this.authService.isLoggedIn = true;
          this.authService.token = response.token;
          this.authService.auth = response.data.user;
          this.authService.usuarioInterno = response.data.usuarioInterno;
          this.authService.usuarioExterno = response.data.usuarioExterno;
          this.authService.roles = response.data.roles;
          this.authService.permissions = response.data.permissions;
          this.authService.zonales = response.data.usuarioInterno?.zonales;
          // this.authService.dpa = response.data.usuarioInterno?.dpa;
          this.messageService.success(response).then();
          this.dpaService.verificarDpa();
          this.catalogosSiturinService.verificarCatalogos();
          this.getDinardapRuc(response.data.user.identification);
          this.authService.role = response.data.roles[0];
          return response;
        })
      );
  }

  logout(): Observable<ServerResponse> {
    const url = `${this.API_URL_PRIVATE}/logout`;

    //this.appService.presentLoading();
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => {
          this.authService.removeLogin();
          return response.data;
        }),
        tap(() => {
          this.routesService.login();
        })
      );
  }

  getDinardapRuc(ruc: string) {
    this.dinardapHttpService.obtenerRuc(ruc).subscribe(ruc => {
      localStorage.setItem('ruc', JSON.stringify(ruc));
    });
  }

  loginGoogle(): Observable<LoginResponse> {
    // const url = `${this.URL_PUBLIC}/login/google`;
    const url = `${this.API_URL_PUBLIC}/login/google`;
    return this.httpClient.get<LoginResponse>(url);
  }

  resetPassword(credentials: PasswordResetModel): Observable<LoginResponse> {
    const url = `${this.API_URL_PUBLIC}/reset-password`;
    return this.httpClient.post<LoginResponse>(url, credentials)
      .pipe(
        map(response => {
          this.messageService.success(response);
          return response
        }),
        catchError(error => {
          this.authService.removeLogin();
          return throwError(error);
        })
      );
  }

  verifyUser(username: string): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/verify-user/${username}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  verifyRuc(ruc: string): Observable<UserModel> {
    const url = `${this.API_URL_PUBLIC}/verify-ruc/${ruc}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response.data),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  verifyTransactionalCodeRegister(transactionalCode: string): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/verify-transactional-code-register/${transactionalCode}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  verifyTransactionalCodePasswordReset(transactionalCode: string): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/verify-transactional-code-password-reset/${transactionalCode}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  verifyEmail(email: string): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/verify-email/${email}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  verifyPhone(phone: string): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/verify-phone/${phone}`;
    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  requestPasswordReset(username: string): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/request-password-reset`;
    return this.httpClient.post<ServerResponse>(url, {username})
      .pipe(
        map(response => {
          this.messageService.success(response);
          return response.data;
        })
      );
  }

  requestEmailReset(identification: string): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/request-email-reset/${identification}`;

    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => {
          return response;
        })
      );
  }

  resetEmail(ruc: string, email: string): Observable<ServerResponse> {
    const url = `${this.API_URL_PUBLIC}/reset-email`;
    return this.httpClient.post<ServerResponse>(url, {ruc, email})
      .pipe(
        map(response => {
          this.messageService.success(response);
          return response
        }),
        catchError(error => {
          this.authService.removeLogin();
          return throwError(error);
        })
      );
  }

  getRoles(): Observable<RoleModel[]> {
    const url = `${this.API_URL_PRIVATE}/roles`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        const roles = response.data as string[];
        return roles.map(role => {
          return {code: role, name: this.rolePipe.transform(role)};
        });
      })
    );
  }

  getProfile(): Observable<UserModel> {
    const url = `${this.API_URL_PRIVATE}/profile`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  getUserInformation(): Observable<UserModel> {
    const url = `${this.API_URL_PRIVATE}/user-information`;

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  updateProfile(payload: UpdateUserDto): Observable<UserModel> {
    const url = `${this.API_URL_PRIVATE}/profile`;

    this.coreService.showLoad();
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  updateUserInformation(payload: UpdateUserDto): Observable<UserModel> {
    const url = `${this.API_URL_PRIVATE}/user-information`;

    this.coreService.showLoad();
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response).then();
        return response.data;
      })
    );
  }

  verifyValidationRequestEmail(ruc: string, email: string, validationDate: string, validationQuestions: any[]): Observable<UserModel> {
    const url = `${this.API_URL_PUBLIC}/verify-validation-questions/${ruc}`;

    return this.httpClient.post<ServerResponse>(url, {validationDate, validationQuestions, email})
      .pipe(
        map(response => {
          this.messageService.success(response).then();
          return response.data;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  getValidationQuestions(ruc: string): Observable<ValidationQuestionModel[]> {
    const url = `${this.API_URL_PUBLIC}/validation-questions/${ruc}`;

    return this.httpClient.get<ServerResponse>(url)
      .pipe(
        map(response => response.data),
        catchError(error => {
          return throwError(error);
        })
      );
  }

  createValidationQuestions(validationQuestions: ValidationQuestionModel[]): Observable<UserModel> {
    const url = `${this.API_URL_PRIVATE}/validation-questions`;

    return this.httpClient.post<ServerResponse>(url, {validationQuestions})
      .pipe(
        map(response => {
          this.messageService.success(response).then();
          return response.data;
        }),
        catchError(error => {
          return throwError(error);
        })
      );
  }
}
