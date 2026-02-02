import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PrimeIcons } from 'primeng/api';
import { Fluid } from 'primeng/fluid';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';

@Component({
    selector: 'app-accommodation',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputNumberModule, CheckboxModule, Fluid],
    templateUrl: './accommodation.component.html',
    styleUrl: './accommodation.component.scss'
})
export class AccommodationComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();
    @Input() modelId!: string | undefined;

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    protected form!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit(): void {
        this.loadData();
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            totalRooms: [null, Validators.required],
            totalBeds: [null, Validators.required],
            totalPlaces: [null, Validators.required],
            regulation: [null, Validators.required]
        });

        this.watchFormChanges();
    }

    saveRegulation(form: FormGroup) {
        this.regulationField.patchValue({ category: form.value.regulation.category, regulationResponses: form.value.regulation.regulationResponses });
    }

    watchFormChanges(): void {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.form.valid) {
                this.dataOut.emit(this.form.value);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];
        const regulationErrors = this.regulationComponent.toArray().flatMap((c) => c.getFormErrors());
        if (regulationErrors.length > 0) regulationErrors.forEach((error) => errors.push(error));
        if (this.totalRoomsField.invalid) errors.push('Debe indicar el número de habitaciones.');
        if (this.totalBedsField.invalid) errors.push('Debe indicar el número de camas.');
        if (this.totalPlacesField.invalid) errors.push('Debe indicar el número de plazas.');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData(): void {}

    // Getters
    get totalRoomsField(): AbstractControl {
        return this.form.controls['totalRooms'];
    }

    get totalBedsField(): AbstractControl {
        return this.form.controls['totalBeds'];
    }

    get totalPlacesField(): AbstractControl {
        return this.form.controls['totalPlaces'];
    }

    get regulationField(): AbstractControl {
        return this.form.controls['regulation'];
    }
}
