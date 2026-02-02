import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { LabelDirective } from '@/utils/directives/label.directive';
import { CustomMessageService } from '@/utils/services';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { Fluid } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-innactivation',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, FormsModule, LabelDirective, AutoCompleteModule, ButtonModule, DialogModule, InputTextModule, InputNumberModule, MessageModule, TableModule, ToggleSwitchModule, ErrorMessageDirective, DatePickerModule],
    templateUrl: './innactivation.component.html',
    styleUrl: './innactivation.component.scss'
})
export class InnactivationComponent implements OnInit{
    @Input() data: string | null = null;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly PrimeIcons = PrimeIcons;
    protected form!: FormGroup;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
        this.watchFormChanges();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            inactivationAt: [null, [Validators.required]],
            inactivationCode: [null, [Validators.required]]
        });
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
            const errors = this.getFormErrors();
            this.fieldErrorsOut.emit(errors);
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.inactivationAtField.invalid) errors.push('Fecha de Inactivación');
        if (this.inactivationCodeField.invalid) errors.push('Código de Inactivación');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get inactivationAtField(): AbstractControl {
        return this.form.controls['inactivationAt'];
    }

    get inactivationCodeField(): AbstractControl {
        return this.form.controls['inactivationCode'];
    }
}
