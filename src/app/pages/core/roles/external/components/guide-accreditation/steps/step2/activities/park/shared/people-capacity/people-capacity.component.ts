import { Component, inject, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { PrimeIcons } from 'primeng/api';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
    selector: 'app-people-capacity',
    imports: [FormsModule, ReactiveFormsModule, FluidModule, MessageModule, ErrorMessageDirective, LabelDirective, InputNumberModule],
    templateUrl: './people-capacity.component.html',
    styleUrl: './people-capacity.component.scss'
})
export class PeopleCapacityComponent implements OnInit {
    public dataIn: InputSignal<any> = input<any>();
    public dataOut: OutputEmitterRef<any> = output<any>();

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;

    constructor() {}

    ngOnInit(): void {
        this.buildForm();
        this.loadData();
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            totalCapacities: [null, [Validators.required, Validators.min(1)]]
        });

        this.watchFormChanges();
    }

    watchFormChanges(): void {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.getFormErrors().length === 0) {
                this.dataOut.emit(this.form.value);
            }
        });
    }

    loadData() {
        if (this.dataIn()) {
            this.form.patchValue(this.dataIn());
        }
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.totalCapacitiesField.invalid) {
            errors.push('Capacidad en número de personas');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    /**
        Getters
    **/
    get totalCapacitiesField(): AbstractControl {
        return this.form.controls['totalCapacities'];
    }
}
