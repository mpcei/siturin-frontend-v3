import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { LabelDirective } from '@utils/directives/label.directive';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';

@Component({
    selector: 'app-requirements',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, Fluid, MessageModule, ToggleSwitchModule, LabelDirective, ToggleSwitchComponent, ErrorMessageDirective],
    templateUrl: './requirements.component.html',
    styleUrl: './requirements.component.scss'
})
export class RequirementsComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected requirementsForm!: FormGroup;

    constructor() {
        this.buildForm();
    }

    ngOnInit(): void {
        this.loadData();
    }

    buildForm(): void {
        this.requirementsForm = this.formBuilder.group({
            hasPropertyRegistrationCertificate: [false, Validators.requiredTrue],
            hasTechnicalReport: [false, Validators.requiredTrue],
            hasStatute: [false, Validators.requiredTrue]
        });

        this.watchFormChanges();
    }

    watchFormChanges(): void {
        this.requirementsForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(() => {
            if (this.requirementsForm.valid) {
                this.dataOut.emit(this.requirementsForm);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (!this.requirementsForm.get('hasPropertyRegistrationCertificate')?.value) {
            errors.push('Debe marcar como disponible el documento: "Certificado de propiedad"');
        }
        if (!this.requirementsForm.get('hasTechnicalReport')?.value) {
            errors.push('Debe marcar como disponible el documento: "Informe técnico"');
        }
        if (!this.requirementsForm.get('hasStatute')?.value) {
            errors.push('Debe marcar como disponible el documento: "Estatuto"');
        }

        if (errors.length > 0) {
            this.requirementsForm.markAllAsTouched();
        }

        return errors;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['data'] && changes['data'].currentValue) {
            this.loadData();
        }
    }

    loadData(): void {}

    // (Opcional) Getters por campo
    get hasPropertyRegistrationCertificateField(): AbstractControl {
        return this.requirementsForm.get('hasPropertyRegistrationCertificate')!;
    }

    get hasTechnicalReportField(): AbstractControl {
        return this.requirementsForm.get('hasTechnicalReport')!;
    }

    get hasStatuteField(): AbstractControl {
        return this.requirementsForm.get('hasStatute')!;
    }
}
