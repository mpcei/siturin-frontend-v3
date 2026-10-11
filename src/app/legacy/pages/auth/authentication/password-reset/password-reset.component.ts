import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {CustomValidators} from "@shared/validators/custom-validators";
import {AuthHttpService, AuthService} from '@services/auth';
import {MessageService} from '@services/core';
import {debounce, debounceTime} from "rxjs";
import {format, isEqual} from "date-fns";
import { PrimeIcons, PrimeTemplate } from "primeng/api";
import { LabelDirective } from '../../../../shared/directives/label.directive';
import { Bind } from 'primeng/bind';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { KeyFilter } from 'primeng/keyfilter';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { NgIf } from '@angular/common';
import { Divider } from 'primeng/divider';
import { PasswordDirective } from 'primeng/password';
import { ProgressBarComponent } from '../../../../shared/components/progress-bar/progress-bar.component';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { ValidationQuestionComponent } from '../validation-question/validation-question.component';
import { Card } from 'primeng/card';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.scss'],
    imports: [ReactiveFormsModule, LabelDirective, Bind, ButtonDirective, Ripple, InputText, KeyFilter, ErrorMessageDirective, NgIf, Divider, PasswordDirective, ProgressBarComponent, Dialog, DatePicker, PrimeTemplate, ValidationQuestionComponent, Card]
})
export class PasswordResetComponent implements OnInit {
  @Output() redirectLoginOut: EventEmitter<string> = new EventEmitter<string>();
  form: UntypedFormGroup;
  progressBar: boolean = false;
  esCodigoTransaccion: boolean = false;
  transactionalCodeValid: boolean = false;
  transactionalCode: FormControl = new FormControl(null, [Validators.required]);
  rucNumber: FormControl = new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(13)]);
  emailControl: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  identificationAtControl: FormControl = new FormControl(null, [Validators.required]);
  identification!: any;
  cargando: boolean = false;
  showPassword: boolean = false;
  emailChangedModal: boolean = false;
  isMatch: boolean = false;
  requestTypeMessage: string = '';
  errorMsg: string = '';
  secretEmail!: string;
  validationQuestions: any[] = [];
  validationDate: Date = new Date();

  constructor(private formBuilder: UntypedFormBuilder,
              private authHttpService: AuthHttpService,
              public messageService: MessageService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.form = this.newForm();
  }

  ngOnInit(): void {
    this.rucNumber.valueChanges.pipe(debounceTime(500)).subscribe(value => {
      if (value && value.length === 13 || value.length === 10) {
        this.cargando = true;
        this.usernameField.setValue(null);
        this.esCodigoTransaccion = false;

        this.authHttpService.verifyRuc(value).subscribe(user => {
          if (user && user?.email.includes('@produccion.gob.ec') && value.length === 10) {
            this.messageService.getErrorsCustom('No se puede recuperar la contraseña', 'El usuario pertenece al Minisiterio de Producción, debe comunicarse con la DTICS');
            this.rucNumber.reset();
            return;
          }

          if (user) {
            const indexA = user.email.indexOf('@');
            const dominio = user.email.substring(indexA, user.email.length);

            let secret;
            let secretLength = 0;

            if (indexA - 3 > 0) {
              secretLength = 3;
            }

            if (indexA - 3 === 0) {
              secretLength = 2;
            }

            if (indexA - 2 === 0) {
              secretLength = 1;
            }

            secret = '*'.repeat(indexA - secretLength);

            this.secretEmailField.setValue(user.email.substring(0, secretLength) + secret + dominio);

            this.usernameField.patchValue(user.email);

            this.rucField.patchValue(user.identification);
          } else {
            this.usernameField.patchValue(null);
            this.rucField.patchValue(null);
            this.messageService.getErrorsCustom('El RUC ingresado no tiene una cuenta en el sistema', '');
          }

          this.cargando = false;
        }, error => this.cargando = false);
      } else {
        this.usernameField.setValue(null);
        this.secretEmailField.setValue(null);
        this.esCodigoTransaccion = false;
      }
    });

    this.transactionalCode.valueChanges.subscribe(value => {
      if (value && value.length === 6) {
        this.transactionalCodeValid = false;
        this.authHttpService.verifyTransactionalCodePasswordReset(value).subscribe(response => {
          this.transactionalCodeValid = true;
          this.tokenField.patchValue(this.transactionalCode.value);
          this.messageService.getInfoCustom('Código Verificado', 'Su código es válido,por favor escriba su contraseña');
        }, error => {
          this.transactionalCodeValid = false;
        });
      }
    });
  }

  newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      token: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(8)]],
      confirmationPassword: [null, [Validators.required]],
      username: [null, [Validators.required]],
      secretEmail: [null, [Validators.required]],
      ruc: [null, [Validators.required]],
    }, {validators: CustomValidators.passwordMatchValidator});
  }

  onSubmit() {
    if (this.form.valid) {
      this.resetPassword();
    } else {
      this.form.markAllAsTouched();
    }
  }

  resetPassword() {
    this.progressBar = true;
    this.authHttpService.resetPassword(this.form.value)
      .subscribe(
        response => {
          this.progressBar = false;
          this.redirectLogin();
        }, error => {
          this.messageService.error(error);
          this.progressBar = false;
        });
  }

  requestTransactionalCodePasswordReset() {
    this.transactionalCode.reset();
    this.transactionalCodeValid = false;
    this.esCodigoTransaccion = false;
    this.cargando = true;
    this.newPasswordField.setValue(null);
    this.confirmationPasswordField.setValue(null);
    this.authHttpService.requestTransactionalCodePasswordReset(this.form.value).subscribe((_) => {
      this.esCodigoTransaccion = true;
      this.cargando = false;
    }, error => this.cargando = false);
  }

  redirectLogin() {
    this.redirectLoginOut.emit('login');
  }

  showEmailChanged() {
    this.cargando = true;
    this.authHttpService.requestEmailReset(this.rucNumber.value).subscribe(response => {
      this.cargando = false;
      this.emailChangedModal = true;
      this.identification = response.data.identification;

      this.requestTypeMessage = 'Ingrese la fecha de emisión/expedición de su cédula';

      if (response.data.type === "juridica") {
        this.requestTypeMessage = 'Ingrese la fecha de emisión/expedición de la cédula del representante legal';
      }
    });

  }

  closeEmailChanged() {
    this.emailChangedModal = false;
    this.identificationAtControl.reset();
    this.form.reset();
    this.rucNumber.reset();
    this.emailControl.reset();
    this.isMatch = false;
    this.errorMsg = '';
  }

  checkIssueAt() {
    this.validationDate = new Date(this.identification.fechaExpedicion.substring(6, 10), this.identification.fechaExpedicion.substring(3, 5) - 1, this.identification.fechaExpedicion.substring(0, 2));
  }

  checkValidationQuestions(questions: any) {
    this.validationQuestions = questions;
  }

  verify() {

    if (this.validationQuestions.length === 0) {
      this.messageService.getErrorsCustom('No cuenta con preguntas de seguridad registradas.', 'Por favor comuníquese con la oficina técnica más cercana para obtener ayuda.');
    }

    if (this.rucNumber.invalid || this.emailControl.invalid || this.identificationAtControl.invalid) {
      this.rucNumber.markAsTouched();
      this.emailControl.markAsTouched();
      return;
    }

    this.cargando = true;
    this.authHttpService.verifyValidationRequestEmail(
      this.rucNumber.value,
      this.emailControl.value,
      format(this.identificationAtControl.value, 'yyyy-MM-dd'),
      this.validationQuestions).subscribe(response => {
      this.cargando = false;
      this.closeEmailChanged();
    }, error => {
      this.cargando = false;
    });
  }

  changeEmail() {
    this.authHttpService.resetEmail(this.rucNumber.value, this.emailControl.value).subscribe(response => {
      this.closeEmailChanged();
    });
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

  get tokenField() {
    return this.form.controls['token'];
  }

  get secretEmailField() {
    return this.form.controls['secretEmail'];
  }

  protected readonly PrimeIcons = PrimeIcons;
}
