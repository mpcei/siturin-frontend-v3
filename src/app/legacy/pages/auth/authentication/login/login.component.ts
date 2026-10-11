import {Component, OnInit} from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AuthHttpService, AuthService} from '@services/auth';
import {CoreService, MessageService, RoutesService} from '@services/core';
import {RolesEnum} from "@shared/enums";
import {environment} from '@env/environment.prod';
import {CatalogosSiturinHttpService, CatalogosSiturinService, DpaHttpService, DpaService} from '@services/siturin';
import {UserModel} from '@models/auth';
import { Bind } from 'primeng/bind';
import { ScrollPanel } from 'primeng/scrollpanel';
import { NgIf, AsyncPipe } from '@angular/common';
import { LabelDirective } from '../../../../shared/directives/label.directive';
import { InputText } from 'primeng/inputtext';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { PasswordDirective } from 'primeng/password';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { ProgressBarComponent } from '../../../../shared/components/progress-bar/progress-bar.component';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { ScrollTop } from 'primeng/scrolltop';
import { PasswordResetComponent } from '../password-reset/password-reset.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [Bind, ScrollPanel, NgIf, ReactiveFormsModule, LabelDirective, InputText, ErrorMessageDirective, PasswordDirective, ButtonDirective, Ripple, ProgressBarComponent, CreateAccountComponent, ScrollTop, PasswordResetComponent, RouterLink, AsyncPipe]
})

export class LoginComponent implements OnInit {
  formLogin: UntypedFormGroup;
  progressBar: boolean = false;
  loaded$ = this.coreService.loaded$;
  isPasswordReset = false;
  transaction: string = 'login';
  scrollNumber: number = 0;
  showPassword: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
              private authHttpService: AuthHttpService,
              private catalogosSiturinHttpService: CatalogosSiturinHttpService,
              private catalogosSiturinService: CatalogosSiturinService,
              private coreService: CoreService,
              private dpaHttpService: DpaHttpService,
              private dpaService: DpaService,
              public messageService: MessageService,
              private authService: AuthService,
              private routesService: RoutesService) {
    this.formLogin = this.newFormLogin();
  }

  ngOnInit(): void {

  }

  newFormLogin(): UntypedFormGroup {
    return this.formBuilder.group({
      // username: ['kfc@gmail.com', [Validators.required]],
      username: [null, [Validators.required]],
      // password: ['12345678', [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.formLogin.valid) {
      this.login();
    } else {
      this.formLogin.markAllAsTouched();
    }
  }

  login() {
    this.progressBar = true;

    this.authHttpService.login(this.formLogin.value)
      .subscribe(
        response => {
          this.validateVersion(response.version);
          this.progressBar = false;
          switch (this.authService.role?.name) {
            case RolesEnum.EXTERNO:
              if (this.authService.usuarioExterno.terminosCondiciones)
                this.routesService.procesoAcreditacion();
              else
                this.routesService.dashboardExterno();
              break;
            case RolesEnum.TECNICO_ZONAL:
              this.routesService.dashboardTecnicoZonal();
              break;
            case RolesEnum.ESPECIALISTA_ZONAL:
              this.routesService.dashboardEspecialistaZonal();
              break;
            case RolesEnum.DAC:
              this.routesService.dashboardDAC();
              break;
            case RolesEnum.GAD:
              this.routesService.dashboardGAD();
              break;
            default:
              this.routesService.dashboardExterno();
          }
        });
  }

  showCreateAccount() {
    this.transaction = 'create';
  }

  showPasswordReset() {
    this.transaction = 'passwordReset';
  }

  hidePasswordReset() {
    this.isPasswordReset = false;
  }

  requestPasswordReset() {
    if (this.usernameField.valid) {
      this.authHttpService.requestPasswordReset(this.usernameField.value)
        .subscribe(
          token => {
            this.routesService.login();
          });
    } else {
      this.usernameField.markAsTouched();
    }
  }

  requestUserUnlock() {
    this.progressBar = true;
    this.authHttpService.login(this.usernameField.value)
      .subscribe(
        response => {
          this.progressBar = false;
          // this.redirect();
        });
  }

  validateVersion(version: string = '0') {
    if (this.coreService.version != version) {
      this.coreService.version = version;
      this.dpaHttpService.obtenerDpa().subscribe(dpa => {
        this.dpaService.dpa = dpa;
      });
      this.catalogosSiturinHttpService.obtenerCatalogos().subscribe(catalogos => {
        this.catalogosSiturinService.catalogos = catalogos;
      });
    }
  }

  get usernameField(): AbstractControl {
    return this.formLogin.controls['username'];
  }

  get passwordField(): AbstractControl {
    return this.formLogin.controls['password'];
  }

  protected readonly environment = environment;
}
