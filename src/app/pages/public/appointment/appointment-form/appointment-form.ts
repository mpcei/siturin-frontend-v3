import {
    Component,
    effect,
    inject,
    input,
    InputSignal,
    OnDestroy,
    OnInit,
    output,
    OutputEmitterRef
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { CatalogueService } from '@utils/services/catalogue.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { InputText } from 'primeng/inputtext';
import { DatePicker } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { environment } from '@env/environment';
import { AppointmentHttpService } from '@/pages/public/appointment/services';
import { debounceTime, Subject } from 'rxjs';
import { CoreService } from '@utils/services';
import { Textarea } from 'primeng/textarea';
import { Button } from 'primeng/button';
import { FontAwesome } from '@/api/font-awesome';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-appointment-form',
    imports: [
        ReactiveFormsModule,
        LabelDirective,
        ErrorMessageDirective,
        InputText,
        DatePicker,
        Select,
        Textarea,
        Button,
        Tooltip
    ],
    templateUrl: './appointment-form.html',
    styleUrl: './appointment-form.scss',
})
export class AppointmentForm implements OnInit, OnDestroy {
    public dataIn: InputSignal<any> = input<any>();
    public submitted: InputSignal<boolean> = input.required<boolean>();
    public dataOut: OutputEmitterRef<any> = output<any>();


    protected readonly environment = environment;

    protected readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreService = inject(CoreService);
    protected form!: FormGroup;
    protected services: string[] = ['Manicura','Depilado de cejas'];
    protected currentDate = new Date();
    protected readonly FontAwesome = FontAwesome;
    private readonly formBuilder = inject(FormBuilder);
    private readonly appointmentHttpService = inject(AppointmentHttpService);
    private destroy$ = new Subject<void>();

    constructor() {
        this.buildForm();

        effect(() => {
            this.submitted();
            this.form.reset();
        });
    }

    get identificationField(): AbstractControl {
        return this.form.controls['identification'];
    }

    get nameField(): AbstractControl {
        return this.form.controls['name'];
    }

    get emailField(): AbstractControl {
        return this.form.controls['email'];
    }

    get cellPhoneField(): AbstractControl {
        return this.form.controls['cellPhone'];
    }

    get serviceField(): AbstractControl {
        return this.form.controls['service'];
    }

    get dateField(): AbstractControl {
        return this.form.controls['date'];
    }

    get notesField(): AbstractControl {
        return this.form.controls['notes'];
    }

    async ngOnInit() {
        await this.loadCatalogues();
        this.loadData();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadData() {
        if (this.dataIn()) {
            this.form.patchValue(this.dataIn());
        }
    }

    async loadCatalogues() {
        // this.services = await this.catalogueService.findByType(CatalogueTypeEnum.activities_geographic_area);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            identification: [null, [Validators.required, Validators.minLength(9)]],
            name: [null, [Validators.required]],
            email: [null, [Validators.email]],
            cellPhone: [null, [Validators.required]],
            service: [null, [Validators.required]],
            date: [null, [Validators.required]],
            notes: [null],
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.subscribe((_) => {
            this.dataOut.emit(this.form.value);
        });

        this.identificationField.valueChanges.pipe(
            debounceTime(300),
        ).subscribe(value => {
            if(this.identificationField.valid) {
            this.appointmentHttpService.verifyRegisteredUser(value).subscribe({
                next: response => {
                    if (!response) {
                        this.nameField.reset();
                        this.emailField.reset();
                        this.cellPhoneField.reset();
                    }else{
                        this.nameField.setValue(response.name);
                        this.emailField.setValue(response.email);
                        this.cellPhoneField.setValue(response.cellPhone);
                    }
                }
            });
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if(this.identificationField.invalid) errors.push('Identificación');
        if(this.identificationField.valid){
        if(this.nameField.invalid) errors.push('Nombre del cliente');
        if(this.emailField.invalid) errors.push('Correo');
        if(this.cellPhoneField.invalid) errors.push('Teléfono');
        if(this.serviceField.invalid) errors.push('Servicio');
        if(this.dateField.invalid) errors.push('Fecha de la cita');
        }
        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    ladingPage(){
        window.location.href = "https://www.francis-nails.com";
    }
}
