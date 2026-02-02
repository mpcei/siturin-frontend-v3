import { Component, EventEmitter, inject, Input, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ProcessComponent } from './sections/process/process.component';
import { EstablishmentComponent } from './sections/establishment/establishment.component';
import { LocationComponent } from './sections/location/location.component';
import { ContactPersonComponent } from './sections/contact-person/contact-person.component';
import { EstablishmentStaffComponent } from './sections/establishment-staff/establishment-staff.component';
import { CustomMessageService } from '@/utils/services';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { ParkComponent } from './activities/park/park.component';
import { AgencyComponent } from './activities/agency/agency.component';
import { AccommodationComponent } from './activities/accommodation/accommodation.component';
import { CtcComponent } from './activities/ctc/ctc.component';
import { FoodDrinkComponent } from './activities/food-drink/food-drink.component';
import { TransportComponent } from './activities/transport/transport.component';
import { EventComponent } from './activities/event/event.component';
import { CatalogueActivitiesCodeEnum } from './enum';

@Component({
    selector: 'app-cadastre-form',
    imports: [
    ReactiveFormsModule,
    ProcessComponent,
    EstablishmentComponent,
    LocationComponent,
    ContactPersonComponent,
    EstablishmentStaffComponent,
    ButtonModule,
    DividerModule,
    ParkComponent,
    AccommodationComponent,
    FoodDrinkComponent,
    TransportComponent,
    EventComponent,
    AgencyComponent,
    CtcComponent,
    
],
    templateUrl: './cadastre-form.component.html',
    styleUrl: './cadastre-form.component.scss'
})
export class CadastreFormComponent {
    protected readonly PrimeIcons = PrimeIcons;
    protected activity = signal<string>('');
    protected classification = signal<string>('');
    nameComponent: CatalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum.food_drink
    catalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum


    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    @ViewChildren(ProcessComponent) private processComponent!: QueryList<ProcessComponent>;
    @ViewChildren(EstablishmentComponent) private establishmentComponent!: QueryList<EstablishmentComponent>;
    @ViewChildren(LocationComponent) private locationComponent!: QueryList<LocationComponent>;
    @ViewChildren(ContactPersonComponent) private contactPersonComponent!: QueryList<ContactPersonComponent>;
    @ViewChildren(EstablishmentStaffComponent) private establishmentStaffComponent!: QueryList<EstablishmentStaffComponent>;



    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;

    protected readonly customMessageService = inject(CustomMessageService);

    constructor() {
        this.mainForm = this.formBuilder.group({
            process: [null],
            establishment: [null],
            location: [null],
            contactPerson: [null],
            establishmentStaff: [null],
        });
    }

    saveForm(childForm: FormGroup, componentName: string) {
         Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }

        });

        switch (componentName) {
            case 'process':
                this.processField.patchValue(childForm.value);
                break;

            case 'establishment':
                this.establishmentField.patchValue(childForm.value);
                break;

            case 'location':
                this.locationField.patchValue(childForm.value);
                break;

            case 'contact-person':
                this.contactPersonField.patchValue(childForm.value);
                break;

            case 'establishment-staff':
                this.establishmentStaffField.patchValue(childForm.value);
                break;

        }
        console.log('Form1 updated:', this.mainForm.value);
        console.log('Form2 updated:', childForm.value);
    }

    onSubmit() {
        if (!this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess() {
        console.log(this.mainForm.value);
    }


    checkFormErrors() {
        const errors: string[] = [
            ...this.processComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.establishmentComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.locationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.contactPersonComponent.toArray().flatMap((c) => c.getFormErrors()),
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }


    get processField(): AbstractControl {
        return this.mainForm.controls['process'];
    }

    get establishmentField(): AbstractControl {
        return this.mainForm.controls['establishment'];
    }

    get locationField(): AbstractControl {
        return this.mainForm.controls['location'];
    }

    get contactPersonField(): AbstractControl {
        return this.mainForm.controls['contactPerson'];
    }

    get establishmentStaffField(): AbstractControl {
        return this.mainForm.controls['establishmentStaff'];
    }

}
