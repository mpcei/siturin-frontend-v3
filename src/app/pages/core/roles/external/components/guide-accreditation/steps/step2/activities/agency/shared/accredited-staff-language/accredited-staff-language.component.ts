import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { InputNumber } from 'primeng/inputnumber';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CoreEnum } from '@utils/enums';
import { CoreSessionStorageService } from '@utils/services';
import { ProcessI, ProcessStep2I } from '@utils/services/core-session-storage.service';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';

@Component({
    selector: 'app-accredited-staff-language',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, InputNumber, InputGroup, InputGroupAddon],
    templateUrl: './accredited-staff-language.component.html',
    styleUrl: './accredited-staff-language.component.scss'
})
export class AccreditedStaffLanguageComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<Record<string, any>>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly PrimeIcons = PrimeIcons;

    protected form!: FormGroup;
    protected sessionDataProcessStep2!: ProcessStep2I;
    protected totalStaff = 0;

    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.loadData();
        this.sessionDataProcessStep2 = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step2);
        this.totalStaff = this.getTotalStaff();
        this.totalAccreditedStaffLanguageField.setValidators([Validators.required, Validators.min(1), Validators.max(this.totalStaff)]);
    }

    getTotalStaff(): number {
        if (this.sessionDataProcessStep2) {
            if (this.sessionDataProcessStep2.totalMen && this.sessionDataProcessStep2.totalWomen) {
                return this.sessionDataProcessStep2.totalMen + this.sessionDataProcessStep2.totalWomen;
            }

            if (this.sessionDataProcessStep2.totalMen) {
                return this.sessionDataProcessStep2.totalMen;
            }

            if (this.sessionDataProcessStep2.totalWomen) {
                return this.sessionDataProcessStep2.totalWomen;
            }
        }
        return 0;
    }

    buildForm() {
        this.form = this.formBuilder.group({
            totalAccreditedStaffLanguage: [null, [Validators.required, Validators.min(1)]],
            percentageAccreditedStaffLanguage: [null, [Validators.required, Validators.min(1)]]
        });

        this.percentageAccreditedStaffLanguageField.disable();

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form.value);

        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form.value);
            }
        });

        this.totalAccreditedStaffLanguageField.valueChanges.subscribe((value) => {
            if (this.totalAccreditedStaffLanguageField.valid) {
                const percentage = Math.round((value / this.totalStaff) * 100);

                this.percentageAccreditedStaffLanguageField.patchValue(percentage);
            } else {
                this.percentageAccreditedStaffLanguageField.patchValue(0);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.totalAccreditedStaffLanguageField.invalid) errors.push('¿Cuántas personas están acreditadas como mínimo el nivel B1 de conocimiento de al menos un idioma extranjero de acuerdo al Marco Común Europeo para las Lenguas?');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get totalAccreditedStaffLanguageField(): AbstractControl {
        return this.form.controls['totalAccreditedStaffLanguage'];
    }

    get percentageAccreditedStaffLanguageField(): AbstractControl {
        return this.form.controls['percentageAccreditedStaffLanguage'];
    }
}
