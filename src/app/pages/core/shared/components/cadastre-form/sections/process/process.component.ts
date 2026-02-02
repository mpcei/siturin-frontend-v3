import { Component, effect, EventEmitter, inject, Input, input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { PrimeIcons } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { CustomMessageService } from '@/utils/services';


@Component({
    selector: 'app-process',
    imports: [ReactiveFormsModule, ErrorMessageDirective,LabelDirective, SelectModule, PanelModule, FluidModule, InputTextModule, InputNumberModule, CardModule, TagModule, SelectModule, DatePickerModule],
    templateUrl: './process.component.html',
    styleUrl: './process.component.scss'
})
export class ProcessComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly PrimeIcons = PrimeIcons;

    protected form!: FormGroup;

    showLocalType = input<boolean>(true);
    showLocalTypeEffect = effect(() => {
        if (!this.showLocalType()) {
            this.form.removeControl('localType');
            console.log('Type establishment control removed from form', this.form.controls);
        }
    });

    constructor() {
        this.buildForm();
    }

    ngOnInit() {
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            ruc: [null, Validators.required],
            code: [null, Validators.required],
            state: [null, Validators.required], //review name variable
            tradeName: [null, [Validators.required]],
            registerNumber: [null, [Validators.required]],
            registeredAt: [null, [Validators.required]],
            activity: [{value: null, disabled:true}, [Validators.required]],
            classification: [{value: null, disabled:true}, [Validators.required]],
            category: [{value: null, disabled:true}, [Validators.required]],
            socialReason: [{value: null, disabled:true}, Validators.required], //review name variable
            legalName: [{value: null, disabled:true}, Validators.required],
            type: [{value: null, disabled:true}, Validators.required]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
            console.log('Form changes detected:', this.form.value);
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.rucField.invalid) errors.push('Su ruc es.');
        if (this.codeField.invalid) errors.push('Codigo.');
        if (this.stateField.invalid) errors.push('Estado del RUC.');
        if (this.tradeNameField.invalid) errors.push('Nombre comercial.');
        if (this.registerNumberField.invalid) errors.push('Numero de registro.');
        if (this.registeredAtField.invalid) errors.push('Fecha de registro.');
        if (this.activityField.invalid) errors.push('Actividades.');
        if (this.classificationField.invalid) errors.push('Orden.');
        if (this.categoryField.invalid) errors.push('Categoria.');
        if (this.socialReasonField.invalid) errors.push('Razón social.');
        if (this.legalNameField.invalid) errors.push('Nombre legal.');
        if (this.typeField.invalid) errors.push('Tipo Trámite');
        //!to do
        //agregar la fecha al correguir

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    //Geters for form controls
    get rucField(): AbstractControl {
        return this.form.controls['ruc'];
    }

    get codeField(): AbstractControl {
        return this.form.controls['code'];
    }

    get stateField(): AbstractControl {
        return this.form.controls['state'];
    }

    get tradeNameField(): AbstractControl {
        return this.form.controls['tradeName'];
    }

    get registerNumberField(): AbstractControl {
        return this.form.controls['registerNumber'];
    }

    get registeredAtField(): AbstractControl {
        return this.form.controls['registeredAt'];
    }

    get activityField(): AbstractControl {
        return this.form.controls['activity'];
    }

    get classificationField(): AbstractControl {
        return this.form.controls['classification'];
    }

    get categoryField(): AbstractControl {
        return this.form.controls['category'];
    }

    get socialReasonField(): AbstractControl {
        return this.form.controls['socialReason'];
    }

    get legalNameField(): AbstractControl {
        return this.form.controls['legalName'];
    }

    get typeField(): AbstractControl {
        return this.form.controls['type'];
    }

    //! To do
    //getter fecha de tramite
}
