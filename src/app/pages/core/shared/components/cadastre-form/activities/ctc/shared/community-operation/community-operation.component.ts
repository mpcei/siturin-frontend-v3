import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

@Component({
    selector: 'app-community-operation',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, MultiSelectModule, CardModule, PanelModule, MessageModule, InputTextModule, DialogModule, TableModule, ButtonModule, TouristGuideComponent, AdventureTourismModalityComponent],
    templateUrl: './community-operation.component.html',
    styleUrl: './community-operation.component.scss'
})
export class CommunityOperationComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    @ViewChildren(TouristGuideComponent) private touristGuideComponent!: QueryList<TouristGuideComponent>;
    @ViewChildren(AdventureTourismModalityComponent) private adventureTourismModalityComponent!: QueryList<AdventureTourismModalityComponent>;

    protected mainForm!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit(): void {
        this.loadData();
    }

    buildForm(): void {
        this.mainForm = this.formBuilder.group({});

        this.watchFormChanges();
    }

    watchFormChanges(): void {
        this.mainForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.mainForm.valid) {
                this.dataOut.emit(this.mainForm.value);
            }
        });
    }

    saveForm(data: Record<string, any>, objectName?: string): void {
        if (objectName) {
            if (!this.mainForm.contains(objectName)) {
                this.mainForm.addControl(objectName, this.formBuilder.control(data));
            } else {
                this.mainForm.get(objectName)?.patchValue(data);
            }
        }
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

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
}
