import { Component, Input } from '@angular/core';
import { RegistrationComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/food-drink/registration/registration.component';
import { CatalogueProcessesTypeEnum } from '@utils/enums';

@Component({
    selector: 'app-food-drink',
    imports: [RegistrationComponent],
    templateUrl: './food-drink.component.html',
    styleUrl: './food-drink.component.scss'
})
export class FoodDrinkComponent {
    @Input() processTypeCode: string = 'registration';
    protected readonly CatalogueProcessesTypeEnum = CatalogueProcessesTypeEnum;
}
