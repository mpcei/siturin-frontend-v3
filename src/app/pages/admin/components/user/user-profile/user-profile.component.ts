import { Component, inject, OnInit } from '@angular/core';
import { UserHttpService } from '@/pages/admin/user-http.service';
import { BreadcrumbService } from '@layout/service';
import { CustomMessageService } from '@utils/services';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { InputText } from 'primeng/inputtext';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Button } from 'primeng/button';
import { invalidEmailValidator, userUpdatedValidator } from '@utils/form-validators/custom-validator';
import { RoleInterface } from '@/pages/auth/interfaces';
import { Divider } from 'primeng/divider';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { Tag } from 'primeng/tag';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { AuthService } from '@/pages/auth/auth.service';
import { dateOnlyToLocalDate } from '@utils/helpers/formats.helper';
import { Avatar } from 'primeng/avatar';
import { Tooltip } from 'primeng/tooltip';
import { environment } from '@env/environment';
import { uploadFileValidator } from '@utils/helpers/file.helper';
import { DateLongPipe } from '@utils/pipes/date-long.pipe';
import { FontAwesome } from '@/api/font-awesome';
import PasswordChangeComponent from '@/pages/admin/components/user/password-change/password-change.component';

@Component({
    selector: 'app-user-profile',
    imports: [Button, Divider, ErrorMessageDirective, FormsModule, InputText, LabelDirective, ReactiveFormsModule, Tag, DatePicker, Select, Avatar, Tooltip, DateLongPipe, PasswordChangeComponent],
    templateUrl: './user-profile.component.html',
    styleUrl: './user-profile.component.scss'
})
export default class UserProfileComponent implements OnInit {
    protected readonly FontAwesome = FontAwesome;
    protected readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly router = inject(Router);
    protected form!: FormGroup;
    protected roles: RoleInterface[] = [];
    protected identificationTypes: CatalogueInterface[] = [];
    protected avatarUrl!: string;
    protected readonly authService = inject(AuthService);
    private readonly authHttpService = inject(AuthHttpService);
    private readonly userHttpService = inject(UserHttpService);
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formBuilder = inject(FormBuilder);

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Mi Perfil' }]);

        this.buildForm();
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

    get usernameField(): AbstractControl {
        return this.form.controls['username'];
    }

    get cellPhoneField(): AbstractControl {
        return this.form.controls['cellPhone'];
    }

    get phoneField(): AbstractControl {
        return this.form.controls['phone'];
    }

    get birthdateField(): AbstractControl {
        return this.form.controls['birthdate'];
    }

    get personalEmailField(): AbstractControl {
        return this.form.controls['personalEmail'];
    }

    get identificationTypeField(): AbstractControl {
        return this.form.controls['identificationType'];
    }

    get avatarField(): AbstractControl {
        return this.form.controls['avatar'];
    }

    get emailVerifiedAtField(): AbstractControl {
        return this.form.controls['emailVerifiedAt'];
    }

    async ngOnInit() {
        await this.loadCatalogues();

        if (this.authService.auth.id) {
            this.find(this.authService.auth.id);
            this.identificationField.setAsyncValidators(userUpdatedValidator(this.authHttpService, this.authService.auth.id));
        }
    }

    async loadCatalogues() {
        this.identificationTypes = await this.catalogueService.findByType(CatalogueTypeEnum.users_identification_type);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            identification: [
                null,
                {
                    validators: [Validators.required],
                    asyncValidators: [userUpdatedValidator(this.authHttpService)],
                    updateOn: 'blur'
                }
            ],
            username: [null, [Validators.required]],
            name: [null, [Validators.required]],
            lastname: [null, [Validators.required, Validators.minLength(3)]],
            email: [null, [Validators.required, invalidEmailValidator()]],
            cellPhone: [null, [Validators.required]],
            phone: [null],
            birthdate: [null, [Validators.required]],
            personalEmail: [null],
            identificationType: [null, [Validators.required]],
            avatar: [null],
            emailVerifiedAt: [{ value: null, disabled: true }]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.identificationField.valueChanges.subscribe((value) => {
            this.usernameField.setValue(value);
        });
    }

    find(id: string) {
        this.userHttpService.findProfile(id).subscribe({
            next: (response: any) => {
                this.form.patchValue({
                    ...response,
                    birthdate: dateOnlyToLocalDate(response.birthdate)
                });

                if (response.avatar) this.avatarUrl = `${environment.PATH_BACKEND_ASSETS}/${response.avatar}`;

                this.roles = response.roles;
            }
        });
    }

    onSubmit() {
        if (this.validateForm()) {
            this.update();
        }
    }

    update() {
        this.userHttpService.updateProfile(this.authService.auth.id, this.form.value).subscribe({
            next: (_) => {
                this.find(this.authService.auth.id);
            }
        });
    }

    uploadAvatar(event: Event) {
        const file = uploadFileValidator(event);

        if (file)
            this.userHttpService.updateAvatar(this.authService.auth.id, file).subscribe({
                next: (response: any) => {
                    this.avatarUrl = `${environment.PATH_BACKEND_ASSETS}/${response.avatar}`;
                }
            });
    }

    validateForm() {
        const errors: string[] = [];

        if (this.identificationField.invalid) errors.push('Identificación');
        if (this.nameField.invalid) errors.push('Nombres');
        if (this.lastnameField.invalid) errors.push('Apellidos');
        if (this.emailField.invalid) errors.push('Correo electrónico');
        if (this.cellPhoneField.invalid) errors.push('Teléfono celular');
        if (this.phoneField.invalid) errors.push('Teléfono');
        if (this.birthdateField.invalid) errors.push('Fecha de nacimiento');
        if (this.personalEmailField.invalid) errors.push('Correo personal');
        if (this.identificationTypeField.invalid) errors.push('Tipo de identificacion');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    goToSecurityQuestions() {
        this.router.navigate(['/security-questions']);
    }
}
