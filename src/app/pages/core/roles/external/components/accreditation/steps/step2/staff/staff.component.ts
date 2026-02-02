import { Component, effect, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { InputNumber } from 'primeng/inputnumber';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-staff',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, InputNumber, ErrorMessageDirective, Message],
    templateUrl: './staff.component.html',
    styleUrl: './staff.component.scss'
})
export class StaffComponent implements OnInit {
    dataIn = input<any>(null);
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected initializedForm = false;

    protected totalStaffControl: FormControl = new FormControl(0, [Validators.required, Validators.min(1)]);

    constructor() {
        effect(() => {
            if (this.dataIn() && !this.initializedForm) {
                this.initializedForm = true;
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
            totalMen: [0],
            totalMenDisability: [0],
            totalWomen: [0],
            totalWomenDisability: [0]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) this.dataOut.emit(this.form.value);
        });

        this.totalMenField.valueChanges.subscribe((value) => {
            if (value && value > 0) {
                if (value < this.totalMenDisabilityField.value) {
                    this.totalMenDisabilityField.setValue(value);
                }

                this.totalStaffControl.patchValue(value + this.totalWomenField.value);
            } else {
                this.totalMenDisabilityField.patchValue(0);
                this.totalStaffControl.patchValue(this.totalWomenField.value);
            }

            this.totalStaffControl.markAsTouched();
        });

        this.totalWomenField.valueChanges.subscribe((value) => {
            if (value && value > 0) {
                if (value < this.totalWomenDisabilityField.value) {
                    this.totalWomenDisabilityField.setValue(value);
                }

                this.totalStaffControl.patchValue(value + this.totalMenField.value);
            } else {
                this.totalWomenDisabilityField.patchValue(0);
                this.totalStaffControl.patchValue(this.totalMenField.value);
            }

            this.totalStaffControl.markAsTouched();
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.totalStaffControl.invalid) errors.push('Personal del Establecimiento');

        if (this.totalMenField.invalid) errors.push('Total de hombres que trabajan en el establecimiento');

        if (this.totalMenDisabilityField.invalid) errors.push('Del total hombres, cuantos tienen discapacidad');

        if (this.totalWomenField.invalid) errors.push('Total de mujeres que trabajan en el establecimiento');

        if (this.totalWomenDisabilityField.invalid) errors.push('Del total mujeres, cuantas tienen discapacidad');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.totalStaffControl.markAsTouched();
        }

        return errors;
    }

    loadData() {
        if (this.dataIn()) {
            this.form.patchValue(this.dataIn()?.establishment);
            this.totalStaffControl.patchValue(this.totalMenField.value + this.totalWomenField.value);
        }
    }

    get totalMenField(): AbstractControl {
        return this.form.controls['totalMen'];
    }

    get totalMenDisabilityField(): AbstractControl {
        return this.form.controls['totalMenDisability'];
    }

    get totalWomenField(): AbstractControl {
        return this.form.controls['totalWomen'];
    }

    get totalWomenDisabilityField(): AbstractControl {
        return this.form.controls['totalWomenDisability'];
    }
}
