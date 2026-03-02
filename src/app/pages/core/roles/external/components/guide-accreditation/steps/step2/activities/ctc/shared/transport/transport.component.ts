import { Component, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {
    TouristTransportCompanyComponent
} from '@/pages/core/shared/components/tourist-transport-company/tourist-transport-company.component';

@Component({
    selector: 'app-transport',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CardModule, PanelModule, MessageModule, ButtonModule, DialogModule, InputTextModule, TableModule, FormsModule],
    templateUrl: './transport.component.html',
    styleUrl: './transport.component.scss'
})
export class TouristTransportCompanyCtcComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();
    @Input() modelId!: string | undefined;

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    @ViewChildren(TouristTransportCompanyComponent) private touristTransportCompanyComponent!: QueryList<TouristTransportCompanyComponent>;

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

        const touristTransportCompanyErrors: string[] = [...this.touristTransportCompanyComponent.toArray().flatMap((c) => c.getFormErrors())];

        if (touristTransportCompanyErrors.length > 0) {
            errors.push('Transporte Turistico');
        }

        if (errors.length > 0) {
            return errors;
        }

        return [];
    }

    loadData(): void {}
}
