import { Component, EventEmitter, inject, Input, OnInit, Optional, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { MultiSelect } from 'primeng/multiselect';

@Component({
    selector: 'app-adventure-modalities',
    standalone: true,
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, ToggleSwitch, MultiSelect],
    templateUrl: './adventure-modalities.component.html',
    styleUrl: './adventure-modalities.component.scss'
})
export class AdventureModalitiesComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;

    protected activitiesWater: CatalogueInterface[] = [
        { name: 'Modalidades recreativas en embarcaciones motorizadas (boya, banana, parasailing y esquí acuático)', id: '1' },
        { name: 'Buceo', id: '2' },
        { name: 'Kayak de mar', id: '3' },
        { name: 'Kayak de lacustre', id: '4' },
        { name: 'Kayak de río', id: '5' },
        { name: 'Kite Surf', id: '6' },
        { name: 'Rafting', id: '7' },
        { name: 'Snorkel', id: '8' },
        { name: 'Surf', id: '9' },
        { name: 'Tubing', id: '10' },        
    ];

    protected activitiesLand: CatalogueInterface[] = [
        { name: 'Alas Delta', id: '1' },
        { name: 'Parapente', id: '2' },
    ];

    protected activitiesAir: CatalogueInterface[] = [
        { name: 'Cabalgata', id: '1' },
        { name: 'Canyoning', id: '2' },
        { name: 'Cicloturismo', id: '3' },
        { name: 'Escalada', id: '4' },
        { name: 'Exploración de cuevas', id: '5' },
        { name: 'Montañismo', id: '6' },
        { name: 'Senderismo', id: '7' },
        { name: 'Salto del puente', id: '8' },
        { name: 'Canopy', id: '9' },
        { name: 'Tarabita', id: '10' },    
    ];

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
            adventureTourismModality: [false, [Validators.required]],
            activitiesWater: [[]],
            activitiesLand: [[]],
            activitiesAir: [[]]
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

        if (this.adventureTourismModalityField.invalid) errors.push('Modalidad de Turismo de Aventura');
        if (this.activitiesWaterField.invalid) errors.push('Actividades en Agua');
        if (this.activitiesLandField.invalid) errors.push('Actividades en Tierra');
        if (this.activitiesAirField.invalid) errors.push('Actividades en Aire');
        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    get adventureTourismModalityField(): AbstractControl {
        return this.form.controls['adventureTourismModality'];
    }   

    get activitiesWaterField(): AbstractControl {
        return this.form.controls['activitiesWater'];
    }

    get activitiesLandField(): AbstractControl {
        return this.form.controls['activitiesLand'];
    }

    get activitiesAirField(): AbstractControl {
        return this.form.controls['activitiesAir'];
    }
}
