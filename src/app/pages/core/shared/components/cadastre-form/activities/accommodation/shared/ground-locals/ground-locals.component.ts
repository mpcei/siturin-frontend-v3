import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { LabelDirective } from '@/utils/directives/label.directive';
import { CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueInterface } from '@/utils/interfaces';
import { CustomMessageService } from '@/utils/services';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { Fluid } from 'primeng/fluid';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-ground-locals',
  standalone: true,
  imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch],
  templateUrl: './ground-locals.component.html',
  styleUrl: './ground-locals.component.scss'
})
export class GroundLocalsComponent {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    private readonly catalogueService = inject(CatalogueService);

    protected form!: FormGroup;

    protected localTypes: CatalogueInterface[] = [];
    protected permanentPhysicalSpaces: CatalogueInterface[] = [];

    constructor() {}

    ngOnInit() {
        this.buildForm();
        this.loadCatalogues();
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            localType: ["null", [Validators.required]],
            hasLandUse: [true, [Validators.required]],
            isProtectedArea: [true, [Validators.required]],
            hasProtectedAreaContract: [false],
            
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.dataOut.emit(this.form);

        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.isProtectedAreaField.valueChanges.subscribe((value) => {
            this.hasProtectedAreaContractField.clearValidators();
            this.hasProtectedAreaContractField.reset();

            if (value) {
                this.hasProtectedAreaContractField.setValidators(Validators.required);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.localTypeField.invalid) errors.push('Su local es');

        if (this.isProtectedAreaField.invalid)
            errors.push(
                '¿Su establecimiento se encuentra dentro del Subsistema Estatal del Sistema Nacional de Areas Protegidas?'
            );

        if (this.hasProtectedAreaContractField.invalid) errors.push('Al momento de la inspección se presentará la licencia única de funcionamiento');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    async loadCatalogues() {
        this.localTypes = await this.catalogueService.findByType(CatalogueTypeEnum.processes_local_type);
    }

    get localTypeField(): AbstractControl {
        return this.form.controls['localType'];
    }

    get hasLandUseField(): AbstractControl {
        return this.form.controls['hasLandUse'];
    }

    get isProtectedAreaField(): AbstractControl {
        return this.form.controls['isProtectedArea'];
    }

    get hasProtectedAreaContractField(): AbstractControl {
        return this.form.controls['hasProtectedAreaContract'];
    }
}
