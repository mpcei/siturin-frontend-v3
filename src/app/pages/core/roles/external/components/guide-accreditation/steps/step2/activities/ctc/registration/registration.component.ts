import { Component, effect, inject, Input, QueryList, ViewChildren } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { TouristActivitiesComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/ctc/shared/tourist-activities/tourist-activities.component';
import { FoodDrinkComponent } from '../shared/food-drink/food-drink.component';
import { RequirementsComponent } from '../shared/requirements/requirements.component';
import { AccommodationComponent } from '../shared/accommodation/accommodation.component';
import { CommunityOperationComponent } from '../shared/community-operation/community-operation.component';
import { CtcHttpService } from '@modules/core/roles/external/services/ctc-http.service';
import { CoreEnum } from '@utils/enums';
import { TouristTransportCompanyCtcComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/ctc/shared/transport/transport.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';

@Component({
    selector: 'app-registration',
    imports: [FormsModule, ReactiveFormsModule, Button, RequirementsComponent, TouristActivitiesComponent, RegulationComponent],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(RequirementsComponent) private requirementsComponent!: QueryList<RequirementsComponent>;
    @ViewChildren(TouristActivitiesComponent) private touristActivitiesComponent!: QueryList<TouristActivitiesComponent>;
    @ViewChildren(FoodDrinkComponent) private foodComponent!: QueryList<FoodDrinkComponent>;
    @ViewChildren(AccommodationComponent) private accommodationComponent!: QueryList<AccommodationComponent>;
    @ViewChildren(CommunityOperationComponent) private communityOperationComponent!: QueryList<CommunityOperationComponent>;
    @ViewChildren(TouristTransportCompanyCtcComponent) private touristTransportCompanyCtcComponent!: QueryList<TouristTransportCompanyCtcComponent>;
    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    protected readonly customMessageService = inject(CustomMessageService);
    protected activities: any[] = [];
    protected readonly ctcHttpService = inject(CtcHttpService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    @Input() modelId!: string | undefined;

    private mainData: Record<string, any> = {};

    constructor() {
        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                if (processSignal.classification?.hasRegulation) this.modelId = processSignal.classification.id;
                if (processSignal.category?.hasRegulation) this.modelId = processSignal.category.id;
            }
        });
    }

    saveForm(data: any, objectName?: string) {
        if (objectName) {
            if (!this.mainData[objectName]) {
                this.mainData[objectName] = {};
            }

            this.mainData[objectName] = { ...this.mainData[objectName], ...data };
        } else {
            this.mainData = { ...this.mainData, ...data };
        }
    }

    async onSubmit() {
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    async saveProcess() {
        const sessionData = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        const payload = {
            ...this.mainData,
            ...sessionData
        };

        console.log(payload);
        this.ctcHttpService.createRegistration(payload).subscribe({
            next: () => {
                console.log('Creado');
            }
        });
    }

    checkFormErrors(): boolean {
        const errors: string[] = [
            ...this.requirementsComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.touristActivitiesComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.foodComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.accommodationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.communityOperationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.touristTransportCompanyCtcComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.regulationComponent.toArray().flatMap((c) => c.getFormErrors())
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

    loadStoredData(): void {}
}
