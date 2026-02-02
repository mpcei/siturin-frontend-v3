import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit(): void {
        this.watchFormChanges();
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            totalCapacities: [null, [Validators.required, Validators.min(1)]]
        });
    }

    watchFormChanges(): void {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });
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

    get totalCapacitiesField(): AbstractControl {
        return this.form.controls['totalCapacities'];
    }
}
