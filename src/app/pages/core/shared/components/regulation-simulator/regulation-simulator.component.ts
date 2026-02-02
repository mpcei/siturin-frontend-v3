import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { RegulationSimulatorFormComponent } from './components/regulation-simulator-form/regulation-simulator-form.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormGroup, FormsModule } from '@angular/forms';
import { CtcComponent } from './components/ctc/ctc.component';
import { Message } from 'primeng/message';
import { AccommodationContinentComponent } from './components/accommodation-continent/accommodation.component';
import { FoodDrinkContinentComponent } from './components/food-drink-continent/food-drink-continent.component';
import { FoodDrinkGalapagosComponent } from './components/food-drink-galapagos/food-drink-galapagos.component';
import { AgencyComponent } from './components/agency/agency.component';
import { ParkComponent } from './components/park/park.component';
import { TouristTransportComponent } from './components/tourist-transport/tourist-transport.component';
import { CatalogueActivitiesCodeEnum, ContributorTypeEnum } from './enum';
import { EventComponent } from './components/event/event.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { CatalogueInterface } from '@/utils/interfaces';
import { ActivityInterface, CategoryInterface, ClassificationInterface } from '../../interfaces';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-regulation-simulator',
    imports: [
        DividerModule,
        RegulationSimulatorFormComponent,
        ToggleSwitchModule,
        FormsModule,
        CtcComponent,
        Message,
        FoodDrinkContinentComponent,
        FoodDrinkGalapagosComponent,
        AgencyComponent,
        TouristTransportComponent,
        ParkComponent,
        AccommodationContinentComponent,
        EventComponent,
        RegulationComponent,
        Fluid
    ],
    templateUrl: './regulation-simulator.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegulationSimulatorComponent {
    protected geographicArea = signal<CatalogueInterface | null>(null);
    protected activity = signal<ActivityInterface | null>(null);
    protected classification = signal<ClassificationInterface | null>(null);
    protected category = signal<CategoryInterface | null>(null);
    protected contributorType = signal<ContributorTypeEnum>(ContributorTypeEnum.natural_person);
    protected modelId = signal<string | undefined>('');
    protected catalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum;

    protected isProtectedArea = false;

    onRegulationSubmitted(event: Record<string, any>) {
        console.log(event);
    }

    watchFormChanges(event: any) {
        this.activity.set(event.activity);

        this.classification.set(event.classification);

        this.geographicArea.set(event.geographicZone);

        this.contributorType.set(event.contributorType);

        this.category.set(event.category);

        if (this.classification()?.hasRegulation) {
            this.modelId.set(this.classification()?.id);
            return;
        }

        if (this.category()?.hasRegulation) {
            this.modelId.set(this.category()?.id);
            return;
        }
    }
}
