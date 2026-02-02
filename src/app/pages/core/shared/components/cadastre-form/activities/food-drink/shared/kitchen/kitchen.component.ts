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
import { MultiSelect } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CatalogueTypeEnum } from '@/utils/enums';
import { CatalogueService } from '@/utils/services/catalogue.service';

@Component({
    selector: 'app-kitchen',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, Divider, MultiSelect, CommonModule],
    templateUrl: './kitchen.component.html',
    styleUrl: './kitchen.component.scss'
})
export class KitchenComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    private readonly catalogueService = inject(CatalogueService);

    protected form!: FormGroup;

    protected kitchenTypes: CatalogueInterface[] = [];

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadCatalogues();
        this.loadData();
    }

    onSubmit() {
        console.log(this.form.value);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            kitchenTypes: [[], [Validators.required]]
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
        if (this.kitchenTypesField.invalid) errors.push('Tipo de Cocina');
        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    async loadCatalogues() {
        this.kitchenTypes = await this.catalogueService.findByType(CatalogueTypeEnum.activities_types_kitchens_continent);
    }

    loadData() {}

    get kitchenTypesField(): AbstractControl {
        return this.form.controls['kitchenTypes'];
    }
}
