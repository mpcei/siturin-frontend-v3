import { Component, effect, inject, input, OnInit, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { InputText } from 'primeng/inputtext';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { invalidEmailDomainValidator, invalidEmailValidator } from '@utils/form-validators/custom-validator';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { AuthService } from '@/pages/auth/auth.service';
import { InputMask } from 'primeng/inputmask';
import { AgePipe } from '@/pages/core/shared/pipes';
import { EstablishmentInterface } from '@/pages/core/shared/interfaces';
import { FormStateService } from '@/pages/core/roles/external/services';

@Component({
    selector: 'app-checklist-form',
    imports: [ReactiveFormsModule, LabelDirective, InputText, ErrorMessageDirective, Select, InputMask, AgePipe],
    templateUrl: './checklist-form.component.html'
})
export class ChecklistFormComponent implements OnInit {
    dataIn = input.required<any[]>();
    dataOut: OutputEmitterRef<any> = output<any>();

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly catalogueService = inject(CatalogueService);
    protected readonly authService = inject(AuthService);
    protected readonly formStateService = inject(FormStateService);

    protected form!: FormGroup;
    protected formInitialized = false;
    protected bloodTypes: CatalogueInterface[] = [];

    protected options: any[] = [
        { code: true, name: 'SI' },
        { code: false, name: 'NO' }
    ];

    constructor() {
        effect(() => {
            if (this.dataIn() && !this.formInitialized) {
                this.formInitialized = true;
                this.loadData();
            }
        });

        this.buildForm();
    }

    async ngOnInit() {
        await this.loadCatalogues();

        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            hasDisability: [null, [Validators.required]],
            bloodType: [null, [Validators.required]],
            phone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^09\d{8}$/)]],
            secondaryPhone: [null, [Validators.minLength(10), Validators.maxLength(10)]],
            email: [null, [invalidEmailValidator(), invalidEmailDomainValidator()]],
            legalName: [{ value: null, disabled: true }],
            nationality: [{ value: this.authService.auth?.nationality?.name, disabled: true }],
            sex: [{ value: this.authService.auth?.sex?.name, disabled: true }],
            birthdate: [{ value: this.authService.auth?.birthdate, disabled: true }]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            this.dataOut.emit(this.form.value);
        });
    }

    async loadCatalogues() {
        this.bloodTypes = await this.catalogueService.findByType(CatalogueTypeEnum.users_blood_type);
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.hasDisabilityField.invalid) errors.push('Discapacidad');

        if (this.bloodTypeField.invalid) errors.push('Tipo de Sangre');

        if (this.phoneField.invalid) errors.push('Número de Teléfono Principal');

        if (this.emailField.invalid) errors.push('Correo Electrónico');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {
        if (this.dataIn()) {
            console.log(this.dataIn());

            this.form.patchValue(this.dataIn());
            this.phoneField.patchValue(this.formStateService.establishmentTemp()?.establishmentContactPerson?.phone);
            this.secondaryPhoneField.patchValue(this.formStateService.establishmentTemp()?.establishmentContactPerson?.secondaryPhone);
            this.emailField.patchValue(this.formStateService.establishmentTemp()?.establishmentContactPerson?.email);
        }
    }

    get legalNameField(): AbstractControl {
        return this.form.controls['legalName'];
    }

    get nationalityField(): AbstractControl {
        return this.form.controls['nationality'];
    }

    get sexField(): AbstractControl {
        return this.form.controls['sex'];
    }

    get birthdateField(): AbstractControl {
        return this.form.controls['birthdate'];
    }

    get hasDisabilityField(): AbstractControl {
        return this.form.controls['hasDisability'];
    }

    get bloodTypeField(): AbstractControl {
        return this.form.controls['bloodType'];
    }

    get phoneField(): AbstractControl {
        return this.form.controls['phone'];
    }

    get secondaryPhoneField(): AbstractControl {
        return this.form.controls['secondaryPhone'];
    }

    get emailField(): AbstractControl {
        return this.form.controls['email'];
    }
}
