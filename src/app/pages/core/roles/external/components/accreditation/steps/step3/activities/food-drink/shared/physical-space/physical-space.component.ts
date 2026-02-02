import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { CommonModule } from '@angular/common';
import { CatalogueActivitiesCodeEnum, CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';

@Component({
    selector: 'app-physical-space',
    standalone: true,
    imports: [Fluid, CommonModule, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitchComponent],
    templateUrl: './physical-space.component.html',
    styleUrl: './physical-space.component.scss'
})
export class PhysicalSpaceComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private readonly catalogueService = inject(CatalogueService);

    protected readonly CatalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum;
    protected form!: FormGroup;

    protected localTypes: CatalogueInterface[] = [];

    constructor() {
        this.buildForm();
    }

    async ngOnInit() {
        await this.loadCatalogues();
        await this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            localType: [null, [Validators.required]],
            hasLandUse: [null, [Validators.requiredTrue]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.localTypeField.invalid) errors.push('Su local es');
        if (this.hasLandUseField.invalid) errors.push('Al momento de la inspección se presentará el Certificado de Informe de compatibilidad de uso de suelo');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    async loadData() {}

    async loadCatalogues() {
        this.localTypes = await this.catalogueService.findByType(CatalogueTypeEnum.processes_local_type);
    }

    get localTypeField(): AbstractControl {
        return this.form.controls['localType'];
    }

    get hasLandUseField(): AbstractControl {
        return this.form.controls['hasLandUse'];
    }
}
