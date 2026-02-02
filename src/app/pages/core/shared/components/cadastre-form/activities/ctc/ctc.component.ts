import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FluidModule } from 'primeng/fluid';
import { DividerModule } from 'primeng/divider';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { EstablishmentComponent } from '../../sections/establishment/establishment.component';
import { ContactPersonComponent } from '../../sections/contact-person/contact-person.component';
import { LocationComponent } from '../../sections/location/location.component';
import { ButtonModule } from 'primeng/button';
import { EstablishmentStaffComponent } from "../../sections/establishment-staff/establishment-staff.component";
import { AccommodationComponent } from './shared/accommodation/accommodation.component';
import { CommunityOperationComponent } from './shared/community-operation/community-operation.component';
import { FoodDrinkComponent } from './shared/food-drink/foodDrink.component';
import { CustomMessageService } from '@/utils/services';

@Component({
    selector: 'app-ctc',
    imports: [
    PanelModule,
    FluidModule,
    DividerModule,
    ButtonModule,
    AccommodationComponent,
    FoodDrinkComponent,
    CommunityOperationComponent
],
    templateUrl: './ctc.component.html',
    styleUrl: './ctc.component.scss'
})
export class CtcComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(AccommodationComponent) private accommodationComponent!: QueryList<AccommodationComponent>;
    @ViewChildren(CommunityOperationComponent) private communityOperationComponent!: QueryList<CommunityOperationComponent>;
    @ViewChildren(FoodDrinkComponent) private foodDrinkComponent!: QueryList<FoodDrinkComponent>;
    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;

    protected readonly customMessageService = inject(CustomMessageService);

    @Output() dataOut = new EventEmitter<FormGroup>();

   constructor() {
        this.mainForm = this.formBuilder.group({});
    }

    saveForm(childForm: FormGroup) {
        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });

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
            ...this.accommodationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.communityOperationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.foodDrinkComponent.toArray().flatMap((c) => c.getFormErrors()),
            
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    loadData(){}


}
