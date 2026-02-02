import { Component, EventEmitter, inject, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Fluid } from "primeng/fluid";
import { Panel } from "primeng/panel";
import { Message } from "primeng/message";
import { MultiSelect } from "primeng/multiselect";
import { Tabs, TabList, Tab, TabPanel } from "primeng/tabs";
import { FoodDrinkComponent } from "../shared/food-drink/food-drink.component";
import { AccommodationComponent } from "../shared/accommodation/accommodation.component";
import { CommunityOperationComponent } from "../shared/community-operation/community-operation.component";
import { TouristTransportCompanyComponent} from "@/pages/core/roles/external/components/accreditation/steps/step3/activities/ctc/shared/transport/transport.component";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RequirementsComponent } from "../shared/requirements/requirements.component";
import { CustomMessageService } from '@utils/services/custom-message.service';
import { PrimeIcons } from 'primeng/api';
import { TouristActivitiesComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/ctc/shared/tourist-activities/tourist-activities.component';
import { TouristGuideComponent } from '@modules/core/shared';
import { ButtonModule } from "primeng/button";

@Component({
  selector: 'app-new-activity',
  imports: [ReactiveFormsModule, CommonModule,/*  Fluid, Panel, Message, MultiSelect, Tabs, TabList, Tab, TabPanel, FoodDrinkComponent, AccommodationComponent, CommunityOperationComponent, TouristTransportCompanyComponent, */ RequirementsComponent, TouristActivitiesComponent, ButtonModule],
  templateUrl: './new-activity.component.html',
  styleUrl: './new-activity.component.scss'
})
export class NewActivityComponent implements OnInit {
  protected readonly PrimeIcons = PrimeIcons;

  @ViewChildren(RequirementsComponent) private requirementsComponent!: QueryList<RequirementsComponent>;
  @ViewChildren(TouristActivitiesComponent) private touristActivitiesComponent!: QueryList<TouristActivitiesComponent>;
  @ViewChildren(FoodDrinkComponent) private foodComponent!: QueryList<FoodDrinkComponent>;
  @ViewChildren(AccommodationComponent) private accommodationComponent!: QueryList<AccommodationComponent>;
  @ViewChildren(CommunityOperationComponent) private communityOperationComponent!: QueryList<CommunityOperationComponent>;
  @ViewChildren(TouristTransportCompanyComponent) private touristTransportCompanyComponent!: QueryList<TouristTransportCompanyComponent>;
  @ViewChildren(TouristGuideComponent) private touristGuideComponent!: QueryList<TouristGuideComponent>;

   private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    protected activities: any[] = []

    protected mainForm!: FormGroup;

    constructor() {
    this.mainForm = this.formBuilder.group({});
    }

    saveForm(childForm: FormGroup): void {
        console.log(childForm.value)
        Object.keys(childForm.controls).forEach(controlName => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    onSubmit(): void {
        if (this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess(): void {
        console.log(this.mainForm.value);
        const data = this.mainForm.value;
        localStorage.setItem('registrationData', JSON.stringify(data));
    }

    checkFormErrors(): boolean {
        const errors: string[] = [
            ...this.requirementsComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.touristActivitiesComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.foodComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.accommodationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.communityOperationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.touristTransportCompanyComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.touristGuideComponent.toArray().flatMap((c) => c.getFormErrors())
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
    ngOnInit(): void {
        this.loadStoredData();
    }
        loadStoredData(): void {
        }


}
