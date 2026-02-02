import { Component, effect, EventEmitter, inject, input, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid, FluidModule } from 'primeng/fluid';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Message } from 'primeng/message';
import { PrimeIcons } from 'primeng/api';
import { Select, SelectModule } from 'primeng/select';
import { DpaInterface } from '@utils/interfaces';
import { Textarea, TextareaModule } from 'primeng/textarea';
import { DpaService } from '@utils/services';
import { MapComponent } from '@utils/components/map/map.component';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'app-location',
    imports: [
    ReactiveFormsModule,
    ErrorMessageDirective,
    FluidModule,
    InputTextModule,
    LabelDirective,
    SelectButtonModule,
    SelectModule,
    MapComponent,
    TextareaModule,
    Message,
    Select
],
    templateUrl: './location.component.html',
    styleUrl: './location.component.scss'
})
export class LocationComponent implements OnInit {
    dataIn = input<any>(null);
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    protected readonly dpaService = inject(DpaService);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected formInitialized = false;

    protected provinces: any[] = [];
    protected cantons: DpaInterface[] = [];
    protected parishes: DpaInterface[] = [];

    constructor() {
        effect(() => {
            if (this.dataIn() && !this.formInitialized) {
                this.formInitialized = true;
                this.loadData();
            }
        });

        this.buildForm();
    }

    async ngOnInit() {
        this.loadData();
        await this.loadDpa();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            province: [null, [Validators.required]],
            canton: [null, [Validators.required]],
            parish: [null, [Validators.required]],
            mainStreet: [null, [Validators.required]],
            numberStreet: [null, [Validators.required]],
            secondaryStreet: [null, [Validators.required]],
            referenceStreet: [null, [Validators.required]],
            latitude: [null, [Validators.required]],
            longitude: [null, [Validators.required]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) this.dataOut.emit(this.form);
        });

        this.provinceField.valueChanges.subscribe(async (value) => {
            if (value) {
                this.cantonField.reset();
                this.parishField.reset();
                this.latitudeField.reset();
                this.longitudeField.reset();
                this.cantons = await this.dpaService.findDpaByParentId(value.id);
            }
        });

        this.cantonField.valueChanges.subscribe(async (value) => {
            if (value) {
                this.parishField.reset();
                this.latitudeField.reset();
                this.longitudeField.reset();
                this.parishes = await this.dpaService.findDpaByParentId(value.id);
            }
        });

        this.parishField.valueChanges.subscribe((value) => {
            if (value) {
                this.latitudeField.patchValue(value.latitude);
                this.longitudeField.patchValue(value.longitude);
            }
        });
    }

    setlatLng(event: any) {
        this.latitudeField.patchValue(event.lat);
        this.longitudeField.patchValue(event.lng);
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.provinceField.invalid) errors.push('Provincia');

        if (this.cantonField.invalid) errors.push('Cantón');

        if (this.parishField.invalid) errors.push('Parroquia');

        if (this.mainStreetField.invalid) errors.push('Calle Principal');

        if (this.numberStreetField.invalid) errors.push('Numeración');

        if (this.secondaryStreetField.invalid) errors.push('Calle Intersección');

        if (this.referenceStreetField.invalid) errors.push('Referencia de Ubicación');

        if (this.latitudeField.invalid) errors.push('Latitud');

        if (this.longitudeField.invalid) errors.push('Longitud');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {
        if (this.dataIn()) {
            this.form.patchValue(this.dataIn());
        }
    }

    async loadDpa() {
        this.provinces = await this.dpaService.findProvinces();
    }

    get provinceField(): AbstractControl {
        return this.form.controls['province'];
    }

    get cantonField(): AbstractControl {
        return this.form.controls['canton'];
    }

    get parishField(): AbstractControl {
        return this.form.controls['parish'];
    }

    get mainStreetField(): AbstractControl {
        return this.form.controls['mainStreet'];
    }

    get numberStreetField(): AbstractControl {
        return this.form.controls['numberStreet'];
    }

    get secondaryStreetField(): AbstractControl {
        return this.form.controls['secondaryStreet'];
    }

    get referenceStreetField(): AbstractControl {
        return this.form.controls['referenceStreet'];
    }

    get latitudeField(): AbstractControl {
        return this.form.controls['latitude'];
    }

    get longitudeField(): AbstractControl {
        return this.form.controls['longitude'];
    }
}
