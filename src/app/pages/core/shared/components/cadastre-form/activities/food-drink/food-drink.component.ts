import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FluidModule } from 'primeng/fluid';
import { DividerModule } from 'primeng/divider';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { EstablishmentCapacityComponent } from './shared/establishment-capacity/establishment-capacity.component';
import { EstablishmentServicesComponent } from './shared/establishment-services/establishment-services.component';
import { CustomMessageService } from '@/utils/services';
import { KitchenComponent } from "./shared/kitchen/kitchen.component";

@Component({
    selector: 'app-food-drink',
    imports: [
    PanelModule,
    FluidModule,
    DividerModule,
    ButtonModule,
    EstablishmentServicesComponent,
    EstablishmentCapacityComponent,
    KitchenComponent
],
    templateUrl: './food-drink.component.html',
    styleUrl: './food-drink.component.scss'
})
export class FoodDrinkComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(EstablishmentCapacityComponent) private establishmentCapacityComponent!: QueryList<EstablishmentCapacityComponent>;
    @ViewChildren(EstablishmentServicesComponent) private establishmentServicesComponent!: QueryList<EstablishmentServicesComponent>;
  
    private formBuilder = inject(FormBuilder);

    @Output() dataOut = new EventEmitter<FormGroup>();

    protected mainForm!: FormGroup;

    protected readonly customMessageService = inject(CustomMessageService);

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
             
            ...this.establishmentCapacityComponent.toArray().flatMap((c) => c.getFormErrors()),   
            ...this.establishmentServicesComponent.toArray().flatMap((c) => c.getFormErrors()),   
            
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    loadData(){}

}

