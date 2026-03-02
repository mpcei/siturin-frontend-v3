import { Component, effect, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Message } from 'primeng/message';
import { invalidEmailValidator } from '@utils/form-validators/custom-validator';
import { PrimeIcons } from 'primeng/api';

@Component({
    selector: 'app-contact-person',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, InputText, InputGroup, InputGroupAddon, ErrorMessageDirective, Message],
    templateUrl: './contact-person.component.html',
    styleUrl: './contact-person.component.scss'
})
export class ContactPersonComponent implements OnInit {
    dataIn = input<any>(null);
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected formInitialized = false;

    constructor() {
        effect(() => {
            if (this.dataIn() && !this.formInitialized) {
                this.formInitialized = true;
                this.loadData();
            }
        });

        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            identification: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
            name: [null, [Validators.required]],
            phone: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
            secondaryPhone: [null, [Validators.minLength(9), Validators.maxLength(10)]],
            email: [null, [Validators.required, invalidEmailValidator()]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) this.dataOut.emit(this.form.getRawValue());
        });
    }

    searchCivilRegistry() {
        const identification = this.identificationField.value;

        if (identification && this.isValidIdentification(identification)) {
            this.simulateCivilRegistrySearch(identification);
        }
    }

    private simulateCivilRegistrySearch(identification: string): void {
        // Simulación de datos del registro civil
        const simulatedData: { [key: string]: string } = {
            '1755368089': 'ANDRADE CAÑAR FERNANDA ESTEFANIA',
            '0961789810': 'PÉREZ GARCÍA JUAN CARLOS',
            '1234567890': 'GARCÍA LÓPEZ MARÍA FERNANDA'
        };

        const fullName = simulatedData[identification] || 'PERSONA NO ENCONTRADA';

        this.form.patchValue({
            name: fullName
        });
    }

    private isValidIdentification(identification: string): boolean {
        if (identification.length !== 10) return false;

        const digits = identification.split('').map(Number);
        const province = parseInt(identification.substring(0, 2));

        if (province < 1 || province > 24) return false;

        const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        let sum = 0;

        for (let i = 0; i < 9; i++) {
            let result = digits[i] * coefficients[i];
            if (result > 9) result -= 9;
            sum += result;
        }

        const verificationDigit = digits[9];
        const remainder = sum % 10;
        const calculatedDigit = remainder === 0 ? 0 : 10 - remainder;

        return calculatedDigit === verificationDigit;
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.identificationField.invalid) errors.push('Cédula de Identidad');

        if (this.nameField.invalid) errors.push('Datos del registro civil');

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
            this.form.patchValue(this.dataIn()?.establishmentContactPerson);
        }
    }

    get identificationField(): AbstractControl {
        return this.form.controls['identification'];
    }

    get nameField(): AbstractControl {
        return this.form.controls['name'];
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
