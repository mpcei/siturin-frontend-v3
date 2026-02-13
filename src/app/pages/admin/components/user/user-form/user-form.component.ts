import { Component, inject, input, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import {
    invalidEmailValidator,
    passwordPolicesValidator,
    userExistValidator,
    userUpdatedValidator
} from '@utils/form-validators/custom-validator';
import { generatePassword } from '@utils/helpers/password-generate.helper';
import { MY_ROUTES } from '@routes';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { BreadcrumbService } from '@layout/service';
import { LabelDirective } from '@utils/directives/label.directive';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { CustomMessageService } from '@utils/services';
import { UserHttpService } from '@/pages/admin/user-http.service';
import { RoleHttpService } from '@/pages/admin/role-http.service';
import { RoleInterface } from '@/pages/auth/interfaces';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Password } from 'primeng/password';
import { MultiSelect } from 'primeng/multiselect';
import { AutoFocus } from 'primeng/autofocus';
import { Tag } from 'primeng/tag';
import { Toolbar } from 'primeng/toolbar';
import { FontAwesome } from '@/api/font-awesome';
import { Tooltip } from 'primeng/tooltip';
import { InputGroup } from 'primeng/inputgroup';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';

@Component({
    selector: 'app-user-form',
    imports: [ReactiveFormsModule, LabelDirective, InputText, ErrorMessageDirective, Button, Password, MultiSelect, FormsModule, AutoFocus, Tag, Toolbar, Tooltip, InputGroup, ToggleSwitchComponent],
    templateUrl: './user-form.component.html',
    styleUrl: './user-form.component.scss'
})
export default class UserFormComponent implements OnInit {
    protected readonly router = inject(Router);
    protected readonly customMessageService = inject(CustomMessageService);
    protected id = input.required<string>();
    protected form!: FormGroup;
    protected roles: RoleInterface[] = [];
    protected passwordActivated = new FormControl(false);
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly authHttpService = inject(AuthHttpService);
    private readonly userHttpService = inject(UserHttpService);
    private readonly roleHttpService = inject(RoleHttpService);

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Listado de Usuarios', routerLink: MY_ROUTES.adminPages.user.absolute }, { label: 'Formulario' }]);

        this.buildForm();
        this.loadRoles();
    }

    get identificationField(): AbstractControl {
        return this.form.controls['identification'];
    }

    get nameField(): AbstractControl {
        return this.form.controls['name'];
    }

    get lastnameField(): AbstractControl {
        return this.form.controls['lastname'];
    }

    get emailField(): AbstractControl {
        return this.form.controls['email'];
    }

    get passwordField(): AbstractControl {
        return this.form.controls['password'];
    }

    get passwordChangedField(): AbstractControl {
        return this.form.controls['passwordChanged'];
    }

    get rolesField(): AbstractControl {
        return this.form.controls['roles'];
    }

    get usernameField(): AbstractControl {
        return this.form.controls['username'];
    }

    ngOnInit() {
        if (this.id()) {
            this.passwordField.clearValidators();
            this.passwordField.disable();
            this.find(this.id());
            this.identificationField.setAsyncValidators(userUpdatedValidator(this.authHttpService, this.id()));
        } else {
            this.passwordActivated.setValue(true);
            this.passwordField.enable();
            this.passwordActivated.disable();
            this.passwordChangedField.setValue(true);
        }

        // if (this.id()) {
        //     this.find(this.id());
        // }
    }

    buildForm() {
        this.form = this.formBuilder.group({
            identification: [
                null,
                {
                    validators: [Validators.required],
                    asyncValidators: [userExistValidator(this.authHttpService)],
                    updateOn: 'blur'
                }
            ],
            username: [null, [Validators.required]],
            password: [null, [Validators.required, passwordPolicesValidator()]],
            passwordChanged: [false],
            name: [null, [Validators.required]],
            lastname: [null, [Validators.required, Validators.minLength(3)]],
            email: [null, [Validators.required, invalidEmailValidator()]],
            roles: [null, [Validators.required]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.emailField.valueChanges.subscribe((value) => {
            this.usernameField.setValue(value);
        });

        this.passwordActivated.valueChanges.subscribe((value) => {
            if (value) {
                this.passwordField.enable();
                this.passwordField.setValidators([Validators.required, passwordPolicesValidator()]);
                this.passwordChangedField.enable();
            } else {
                this.passwordField.clearValidators();
                this.passwordField.disable();
                this.passwordField.reset();
                this.passwordChangedField.reset();
                this.passwordChangedField.disable();
            }

            this.passwordField.updateValueAndValidity();
        });
    }

    find(id: string) {
        this.userHttpService.findOne(id).subscribe({
            next: (response: any) => {
                this.form.patchValue(response);
                if (this.id()) {
                    this.passwordChangedField.setValue(false);
                    this.passwordChangedField.disable();
                }
            }
        });
    }

    loadRoles() {
        this.roleHttpService.findCatalogues().subscribe({
            next: (response) => {
                this.roles = response;
            }
        });
    }

    onSubmit() {
        if (this.validateForm()) {
            if (this.id()) {
                this.update();
            } else {
                this.create();
            }
        }
    }

    validateForm() {
        const errors: string[] = [];

        if (this.identificationField.invalid) errors.push('Identificación');
        if (this.nameField.invalid) errors.push('Nombres');
        if (this.lastnameField.invalid) errors.push('Apellidos');
        if (this.emailField.invalid) errors.push('Correo electrónico');
        if ((this.passwordActivated && this.passwordField.invalid) || (!this.id() && this.passwordField.invalid)) errors.push('Contraseña');
        if (this.rolesField.invalid) errors.push('Roles');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    create() {
        this.userHttpService.create(this.form.value).subscribe({
            next: (_) => {
                this.return();
            }
        });
    }

    update() {
        this.userHttpService.update(this.id(), this.form.value).subscribe({
            next: (_) => {
                this.return();
            }
        });
    }

    return() {
        this.router.navigate([MY_ROUTES.adminPages.user.absolute]);
    }

    async autoGeneratePassword() {
        this.passwordField.patchValue(generatePassword({ length: 8 }));
        await navigator.clipboard.writeText(this.passwordField.value);
        this.customMessageService.showSuccess({ summary: 'Contraseña copiada', detail: '********' });
    }

    protected readonly FontAwesome = FontAwesome;
}
