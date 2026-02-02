import { Component, effect, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-business-info-component',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, InputText, ErrorMessageDirective, Message],
    templateUrl: './business-info-component.component.html',
    styleUrl: './business-info-component.component.scss'
})
export class BusinessInfoComponent implements OnInit {
    dataIn = input<any>(null);
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);

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
            tradeName: [null],
            webPage: [null]
        });

        this.tradeNameField.disable();

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            this.dataOut.emit(this.form.value);
        });
    }

    loadData() {
        console.log(this.dataIn());
        if (this.dataIn()) {
            this.form.patchValue(this.dataIn()?.establishment);
        }
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.webPageField.invalid) {
            errors.push('Dirección URL de la Página WEB');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    get tradeNameField(): AbstractControl {
        return this.form.controls['tradeName'];
    }

    get webPageField(): AbstractControl {
        return this.form.controls['webPage'];
    }
}
