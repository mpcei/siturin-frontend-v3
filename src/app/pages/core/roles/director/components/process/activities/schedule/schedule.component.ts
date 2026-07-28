import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InternalInspectionInterface } from '../../interfaces/internal-inspection.interface';
import { InternalInspectionService } from '../../services/internal-inspection.service';
import { PrimeIcons } from 'primeng/api';
import { Fluid } from 'primeng/fluid';
import { Message } from 'primeng/message';

@Component({
    selector: 'app-schedule',
    imports: [FormsModule, Dialog, ButtonModule, DatePickerModule, DividerModule, CardModule, ReactiveFormsModule, Fluid, Message],
    templateUrl: './schedule.component.html',
    styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;

    visible: boolean = false;
    date: Date = new Date();

    showDialog() {
        this.visible = true;
    }

    constructor(private internalInspectionService: InternalInspectionService) {
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            processId: ['4d2ace64-0701-4dfb-8abc-f12058882f4d'],
            inspectionAt: [this.date, [Validators.required]]
        });
    }

    inspectionAssignment() {
        if (this.form.valid) {
            this.internalInspectionService.create(this.form.value).subscribe({
                next: (res) => {
                    console.log('Inspección creada:', res);
                    this.visible = false;
                },
                error: (err) => {
                    console.error('Error al crear inspección:', err);
                }
            });
            console.log(this.form.value);
        } else {
            console.warn('Formulario inválido');
        }
    }

    createInternalInspection(payload: InternalInspectionInterface) {
        this.internalInspectionService.create(payload).subscribe({
            next: (data: any) => {
                console.log('Inspección creada correctamente:', data);
            },
            error: (error: any) => {
                console.error('Error al crear inspección:', error);
            }
        });
    }

    get processIdField(): AbstractControl {
        return this.form.controls['processId'];
    }

    get inspectionAtField(): AbstractControl {
        return this.form.controls['inspectionAt'];
    }

    protected readonly PrimeIcons = PrimeIcons;
}
