import { Component, inject, OnInit } from '@angular/core';
import { CustomMessageService } from '@utils/services';
import { Router } from '@angular/router';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Button } from 'primeng/button';
import { matchPasswords, passwordPolicesValidator } from '@utils/form-validators/custom-validator';
import { Password } from 'primeng/password';
import { Divider } from 'primeng/divider';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { AuthService } from '@/pages/auth/auth.service';
import { FontAwesome } from '@/api/font-awesome';
import { TransactionalCodeComponent } from '@utils/components/transactional-code/transactional-code.component';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';

@Component({
    selector: 'app-password-change',
    imports: [Button, Divider, ErrorMessageDirective, FormsModule, LabelDirective, Password, ReactiveFormsModule, TransactionalCodeComponent, ToggleSwitchComponent],
    templateUrl: './password-change.component.html'
})
export default class PasswordChangeComponent implements OnInit {
    protected readonly FontAwesome = FontAwesome;
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly router = inject(Router);
    protected form!: FormGroup;
    protected passwordActivated = new FormControl(false);
    protected readonly authService = inject(AuthService);
    protected transactionalCodeControl = new FormControl({ value: '', disabled: true });
    private readonly authHttpService = inject(AuthHttpService);
    private readonly formBuilder = inject(FormBuilder);

    constructor() {
        this.buildForm();
    }

    get passwordField(): AbstractControl {
        return this.form.controls['password'];
    }

    protected get passwordConfirmField(): AbstractControl {
        return this.form.controls['passwordConfirm'];
    }

    async ngOnInit() {}

    buildForm() {
        this.form = this.formBuilder.group(
            {
                password: [null, [Validators.required, passwordPolicesValidator()]],
                passwordConfirm: [null, [Validators.required]]
            },
            { validators: [matchPasswords('password', 'passwordConfirm')] }
        );

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.transactionalCodeControl.statusChanges.subscribe((status) => {
            if (status === 'VALID') {
                this.passwordField.enable();
            }
        });

        this.passwordActivated.valueChanges.subscribe((value) => {
            if (!value) {
                this.passwordField.disable();
                this.passwordField.reset();
                this.transactionalCodeControl.reset();
                this.transactionalCodeControl.disable();
            }
        });
    }

    protected requestTransactionalCode() {
        this.authHttpService.requestTransactionalCode().subscribe({
            next: (_) => {
                this.transactionalCodeControl.enable();
                this.transactionalCodeControl.reset();
                this.passwordField.disable();
                this.passwordField.reset();
            }
        });
    }

    onSubmit() {
        if (this.validateForm()) {
            this.changePassword();
        }
    }

    changePassword() {
        this.authHttpService.changePassword(this.form.value).subscribe({
            next: (_) => {
                this.passwordActivated.reset();
                this.transactionalCodeControl.reset();
                this.transactionalCodeControl.disable();
                this.passwordField.reset();
                this.passwordConfirmField.reset();
            }
        });
    }

    validateForm() {
        const errors: string[] = [];

        if (this.passwordField.invalid && (this.passwordActivated || !this.authService.auth.id)) errors.push('Contraseña');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
