import {Component, OnInit} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {CustomValidators} from "@shared/validators/custom-validators";
import {AuthHttpService, AuthService} from '@services/auth';
import {CoreService, MessageService} from '@services/core';
import { LabelDirective } from '../../../../shared/directives/label.directive';
import { Bind } from 'primeng/bind';
import { PasswordDirective } from 'primeng/password';
import { ErrorMessageDirective } from '../../../../shared/directives/error-message.directive';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { NgIf, AsyncPipe } from '@angular/common';
import { ProgressBarComponent } from '../../../../shared/components/progress-bar/progress-bar.component';

@Component({
    selector: 'app-password-change',
    templateUrl: './password-change.component.html',
    styleUrls: ['./password-change.component.scss'],
    imports: [ReactiveFormsModule, LabelDirective, Bind, PasswordDirective, ErrorMessageDirective, ButtonDirective, Ripple, NgIf, ProgressBarComponent, AsyncPipe]
})
export class PasswordChangeComponent implements OnInit {
  form: UntypedFormGroup = this.newForm();
  loaded$ = this.coreService.loaded$;
  progressBar: boolean = false;

  constructor(
    private authHttpService: AuthHttpService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private coreService: CoreService,
    private formBuilder: UntypedFormBuilder,
    public messageService: MessageService,
  ) {
  }

  ngOnInit(): void {

  }

  newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      confirmationPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required, Validators.minLength(8)]],
      oldPassword: [null, [Validators.required]],
    }, {validators: CustomValidators.passwordMatchValidator});
  }

  onSubmit() {
    if (this.form.valid) {
      this.changePassword();
    } else {
      this.form.markAllAsTouched();
      this.messageService.errorsFields.then();
    }
  }

  changePassword() {
    this.authHttpService.changePassword(this.form.value).subscribe((_) => {
    });
  }

  get confirmationPasswordField() {
    return this.form.controls['confirmationPassword'];
  }

  get newPasswordField() {
    return this.form.controls['newPassword'];
  }

  get oldPasswordField() {
    return this.form.controls['oldPassword'];
  }
}
