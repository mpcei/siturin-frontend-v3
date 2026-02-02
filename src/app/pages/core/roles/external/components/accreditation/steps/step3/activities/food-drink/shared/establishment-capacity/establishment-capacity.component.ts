import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { Divider } from 'primeng/divider';
import { InputNumber } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CatalogueActivitiesCodeEnum, CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueService } from '@/utils/services/catalogue.service';

@Component({
    selector: 'app-establishment-capacity',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, Divider, InputNumber, CommonModule],
    templateUrl: './establishment-capacity.component.html',
    styleUrl: './establishment-capacity.component.scss'
})
export class EstablishmentCapacityComponent implements OnInit {
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

    protected typeEstablishments: CatalogueInterface[] = [];

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    onSubmit() {
        console.log(this.form.value);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            totalTables: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
            totalCapacities: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
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

        if (this.tablesField.invalid) errors.push('Número de mesas');
        if (this.capacityField.invalid) errors.push('Capacidad en número de personas');
        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    async loadCatalogues() {
        this.typeEstablishments = await this.catalogueService.findByType(CatalogueTypeEnum.process_food_drinks_establishment_type);
    }

    loadData() {}

    get tablesField(): AbstractControl {
        return this.form.controls['totalTables'];
    }

    get capacityField(): AbstractControl {
        return this.form.controls['totalCapacities'];
    }
}
