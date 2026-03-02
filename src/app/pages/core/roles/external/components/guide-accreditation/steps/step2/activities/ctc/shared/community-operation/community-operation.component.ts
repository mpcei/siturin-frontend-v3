import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { TouristGuideComponent } from '@modules/core/shared';
import { AdventureTourismModalityComponent } from '@modules/core/shared/components/adventure-tourism-modality/adventure-tourism-modality.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';

@Component({
    selector: 'app-community-operation',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectModule, CardModule, PanelModule, MessageModule, InputTextModule, DialogModule, TableModule, ButtonModule],
    templateUrl: './community-operation.component.html',
    styleUrl: './community-operation.component.scss'
})
export class CommunityOperationComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();
    @Input() modelId!: string | undefined;

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    @ViewChildren(TouristGuideComponent) private touristGuideComponent!: QueryList<TouristGuideComponent>;
    @ViewChildren(AdventureTourismModalityComponent) private adventureTourismModalityComponent!: QueryList<AdventureTourismModalityComponent>;
    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    protected mainForm!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit(): void {
        this.loadData();
    }

    buildForm(): void {
        this.mainForm = this.formBuilder.group({
            regulation: [null, Validators.required]
        });

        this.watchFormChanges();
    }

    watchFormChanges(): void {
        this.mainForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.mainForm.valid) {
                this.dataOut.emit(this.mainForm.value);
            }
        });
    }

    saveRegulation(form: FormGroup) {
        this.regulationField.patchValue({ category: form.value.regulation.category, regulationResponses: form.value.regulation.regulationResponses });
    }

    saveForm(childForm: FormGroup): void {
        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];
        const regulationErrors = this.regulationComponent.toArray().flatMap((c) => c.getFormErrors());
        if (regulationErrors.length > 0) regulationErrors.forEach((error) => errors.push(error));
        const touristGuideErrors: string[] = [...this.touristGuideComponent.toArray().flatMap((c) => c.getFormErrors())];
        const adventureTourismModalityErrors: string[] = [...this.adventureTourismModalityComponent.toArray().flatMap((c) => c.getFormErrors())];

        if (touristGuideErrors.length > 0) {
            errors.push('Guías de Turismo');
        }

        if (adventureTourismModalityErrors.length > 0) {
            errors.push('Modalidad de Turismo Aventura');
        }

        if (errors.length > 0) {
            return errors;
        }

        return [];
    }

    loadData(): void {}

    // Getters
    get regulationField(): AbstractControl {
        return this.mainForm.controls['regulation'];
    }
}
