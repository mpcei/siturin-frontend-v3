import { Component, inject, OnInit } from '@angular/core';
import { UserHttpService } from '@/pages/admin/user-http.service';
import { CustomMessageService } from '@utils/services';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { Select } from 'primeng/select';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { AuthService } from '@/pages/auth/auth.service';
import { Tooltip } from 'primeng/tooltip';
import { FontAwesome } from '@modules/public/icons/font-awesome';
import { Textarea } from 'primeng/textarea';

@Component({
    selector: 'app-additional-information',
    imports: [Button, Divider, ErrorMessageDirective, FormsModule, LabelDirective, ReactiveFormsModule, Select, Tooltip, Textarea],
    templateUrl: './additional-information.component.html'
})
export default class AdditionalInformationComponent implements OnInit {
    protected readonly FontAwesome = FontAwesome;
    protected readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly router = inject(Router);
    protected form!: FormGroup;
    protected bloodTypes: CatalogueInterface[] = [];
    protected ethnicOrigins: CatalogueInterface[] = [];
    protected genders: CatalogueInterface[] = [];
    protected maritalStatuses: CatalogueInterface[] = [];
    protected nationalities: CatalogueInterface[] = [];
    protected sexes: CatalogueInterface[] = [];
    protected readonly authService = inject(AuthService);
    private readonly userHttpService = inject(UserHttpService);
    private readonly formBuilder = inject(FormBuilder);

    constructor() {
        this.buildForm();
    }

    get allergiesField(): AbstractControl {
        return this.form.controls['allergies'];
    }

    get bloodTypeField(): AbstractControl {
        return this.form.controls['bloodType'];
    }

    get ethnicOriginField(): AbstractControl {
        return this.form.controls['ethnicOrigin'];
    }

    get genderField(): AbstractControl {
        return this.form.controls['gender'];
    }

    get maritalStatusField(): AbstractControl {
        return this.form.controls['maritalStatus'];
    }

    get nationalityField(): AbstractControl {
        return this.form.controls['nationality'];
    }

    get sexField(): AbstractControl {
        return this.form.controls['sex'];
    }

    async ngOnInit() {
        await this.loadCatalogues();

        if (this.authService.auth.id) {
            this.find(this.authService.auth.id);
        }
    }

    async loadCatalogues() {
        this.bloodTypes = await this.catalogueService.findByType(CatalogueTypeEnum.users_blood_type);
        this.ethnicOrigins = await this.catalogueService.findByType(CatalogueTypeEnum.users_ethnic_origin);
        this.genders = await this.catalogueService.findByType(CatalogueTypeEnum.users_gender);
        this.maritalStatuses = await this.catalogueService.findByType(CatalogueTypeEnum.users_marital_status);
        this.nationalities = await this.catalogueService.findByType(CatalogueTypeEnum.users_nationality);
        this.sexes = await this.catalogueService.findByType(CatalogueTypeEnum.users_sex);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            bloodType: [null],
            ethnicOrigin: [null],
            gender: [null],
            sex: [null],
            maritalStatus: [null],
            nationality: [null],
            allergies: [null]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {}

    find(id: string) {
        this.userHttpService.findProfile(id).subscribe({
            next: (response: any) => {
                this.form.patchValue(response);
            }
        });
    }

    onSubmit() {
        if (this.validateForm()) {
            this.update();
        }
    }

    update() {
        this.userHttpService.updateAdditionalInformation(this.authService.auth.id, this.form.value).subscribe({
            next: (_) => {
                this.find(this.authService.auth.id);
            }
        });
    }

    validateForm() {
        const errors: string[] = [];

        if (this.bloodTypeField.invalid) errors.push('Tipo de sangre');
        if (this.ethnicOriginField.invalid) errors.push('Etnia');
        if (this.genderField.invalid) errors.push('Género');
        if (this.sexField.invalid) errors.push('Sexo');
        if (this.maritalStatusField.invalid) errors.push('Estado civil');
        if (this.nationalityField.invalid) errors.push('Nacionalidad');
        if (this.allergiesField.invalid) errors.push('Alergias');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
