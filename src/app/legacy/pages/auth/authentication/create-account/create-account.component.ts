import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {AuthHttpService, AuthService} from '@services/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {CoreService, MessageService} from '@services/core';
import {CustomValidators} from '@shared/validators/custom-validators';
import {DinardapHttpService} from '@services/siturin';
import {environment} from "@env/environment";
import { LabelDirective } from '../../../../shared/directives/label.directive';
import { Bind } from 'primeng/bind';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { KeyFilter } from 'primeng/keyfilter';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { NgIf } from '@angular/common';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { PasswordDirective } from 'primeng/password';
import { ProgressBarComponent } from '../../../../shared/components/progress-bar/progress-bar.component';

@Component({
    selector: 'app-create-account',
    templateUrl: './create-account.component.html',
    styleUrls: ['./create-account.component.scss'],
    imports: [ReactiveFormsModule, LabelDirective, Bind, ButtonDirective, Ripple, InputText, KeyFilter, ErrorMessageDirective, NgIf, SkeletonComponent, PasswordDirective, ProgressBarComponent]
})
export class CreateAccountComponent implements OnInit {
  @Output() redirectLoginOut: EventEmitter<string> = new EventEmitter<string>();
  @Output() scrollNumberOut: EventEmitter<number> = new EventEmitter<number>();
  form: UntypedFormGroup = this.newForm();
  loaded$ = this.coreService.loaded$;
  progressBar: boolean = false;
  rucNumber: FormControl = new FormControl(null, [Validators.required]);
  transactionalCode: FormControl = new FormControl(null, [Validators.required]);
  transactionalCodeValid: boolean = false;
  esCodigoTransaccion: boolean = false;
  errorRuc: boolean = false;
  cargando: boolean = false;
  correoValido: boolean = false;
  showPassword: boolean = false;
  constructor(
    private authHttpService: AuthHttpService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,
    private dinardapHttpService: DinardapHttpService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
    public router: Router,
  ) {
    this.rucNumber.valueChanges.subscribe(value => {
      this.rucField.reset();
      this.form.reset();
      this.transactionalCode.reset();
      this.esCodigoTransaccion = false;
      this.transactionalCodeValid = false;

      if (value.length === 13) {
        this.cargando = true;
        this.errorRuc = false;
        this.authHttpService.verifyRuc(value).subscribe(response => {
          if (response == null) {
            this.dinardapHttpService.obtenerRuc(value).subscribe(ruc => {
              if (ruc?.ruc == null) {
                this.messageService.getErrorsCustom('Se tuvo problemas al verificar su RUC o no es válido', 'Por favor intente de nuevo');
              }
              this.cargando = false;
              this.errorRuc = false;
              this.rucField.patchValue(ruc);
            }, error => {
              this.errorRuc = true;
              this.cargando = false;
            });
          } else {
            this.errorRuc = true;
            this.cargando = false;
            this.messageService.getErrorsCustom('El usuario ya existe', 'Por favor ingrese otro RUC');
          }
        });
      }

      if (value.length > 13) {
        this.messageService.getErrorsCustom('El RUC no puede tener más de 13 dígitos', 'Intente de nuevo');
      }
    });

    this.transactionalCode.valueChanges.subscribe(value => {
      if (value && value.length === 6) {
        this.transactionalCodeValid = false;
        this.authHttpService.verifyTransactionalCodeRegister(value).subscribe(response => {
          this.transactionalCodeValid = true;
          this.messageService.getInfoCustom('Código Verificado', 'Su código es válido,por favor escriba su contraseña');
        }, error => {
          this.transactionalCodeValid = false;
        });
      }
    });

    this.usernameField.valueChanges.subscribe(value => {
      this.correoValido = true;
      if (this.validarCorreoInstitucional(value) > 0) {
        this.correoValido = false;
        this.messageService.getErrorsCustom('Correo no Válido', `No puede ingresar un correo que pertenezca al ${environment.MINISTERIO}`);
      }
    })
  }

  ngOnInit(): void {

  }

  newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      username: [null, [Validators.required, Validators.email]],
      ruc: [null, [Validators.required]],
      confirmationPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(8)]],
    }, {validators: CustomValidators.passwordMatchValidator});
  }

  onSubmit() {
    if (this.form.valid) {
      this.createAccount();
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  requestTransactionalCodeRegister() {
    this.transactionalCode.reset();
    this.esCodigoTransaccion = false;
    this.cargando = true;
    this.authHttpService.requestTransactionalCodeRegister(this.form.value).subscribe((_) => {
      this.esCodigoTransaccion = true;
      this.cargando = false;
    }, error => this.cargando = false);
  }

  createAccount() {
    this.cargando = true;
    this.authHttpService.registerExternalUser(this.form.value).subscribe((_) => {
      this.cargando = true;
      this.redirectLoginOut.emit('login');
    }, error => this.cargando = false);
  }

  validarCorreoInstitucional(correo: string) {
    if (correo)
      return correo.search('@produccion.gob.ec');
    return -1;
  }

  redirectLogin() {
    this.redirectLoginOut.emit('login');
  }

  get confirmationPasswordField() {
    return this.form.controls['confirmationPassword'];
  }

  get newPasswordField() {
    return this.form.controls['newPassword'];
  }

  get usernameField() {
    return this.form.controls['username'];
  }

  get rucField() {
    return this.form.controls['ruc'];
  }

  protected readonly environment = environment;
}
