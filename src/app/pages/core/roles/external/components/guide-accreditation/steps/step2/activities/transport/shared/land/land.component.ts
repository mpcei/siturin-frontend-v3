import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { DatePickerModule } from 'primeng/datepicker';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import {
    TypeVehiclesComponent
} from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/transport/shared/type-vehicles/type-vehicles.component';


@Component({
    selector: 'app-land',
    imports: [ReactiveFormsModule, FluidModule, SelectModule, LabelDirective, ErrorMessageDirective, ToggleSwitchModule, InputTextModule, DatePickerModule, InputNumberModule, Message, TypeVehiclesComponent],
    templateUrl: './land.component.html',
    styleUrl: './land.component.scss'
})
export class LandComponent {
    protected readonly formBuilder = inject(FormBuilder);
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected form!: FormGroup;

    protected localTypes: CatalogueInterface[] = [
        { name: 'Islas de Centros Comerciales', code: 'islas' },
        { name: 'Local Comercial', code: 'comercial' },
        { name: 'Oficinas', code: 'oficinas' },
        { name: 'Oficinas Compartidas', code: 'compartidas' }
    ];

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            localType: [null, Validators.required],
            certified: [null, Validators.required],
            certifiedCode: [null, Validators.required],
            certifiedIssueAt: [null, Validators.required],
            certifiedExpirationAt: [null, Validators.required]
        });

        this.watchFormChanges();
    }
    watchFormChanges() {
        this.form.valueChanges.subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.localTypeField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }
        if (this.certifiedField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }
        if (this.certifiedCodeField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }
        if (this.certifiedIssueAtField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }
        if (this.certifiedExpirationAtField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }
        if (this.certifiedCodeField.invalid) {
            errors.push('Debe seleccionar un Tipo de Local.');
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    get certifiedField(): AbstractControl {
        return this.form.controls['certified'];
    }

    get localTypeField(): AbstractControl {
        return this.form.controls['localType'];
    }

    get certifiedCodeField(): AbstractControl {
        return this.form.controls['certifiedCode'];
    }

    get certifiedIssueAtField(): AbstractControl {
        return this.form.controls['certifiedIssueAt'];
    }

    get certifiedExpirationAtField(): AbstractControl {
        return this.form.controls['certifiedExpirationAt'];
    }
}
