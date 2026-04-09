import { Component, inject } from '@angular/core';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { BreadcrumbService } from '@layout/service';
import {
    Step1Component
} from '@modules/core/roles/external/components/guide-accreditation/steps/step1/step1.component';
import {
    Step2Component
} from '@modules/core/roles/external/components/guide-accreditation/steps/step2/step2.component';
import { FormStateService } from '@modules/core/roles/external/services';
import { Message } from 'primeng/message';
import { EstablishmentNumberPipe } from '@/pages/core/shared/pipes';
import FontAwesomeIcons from '@/pages/public/icons/font-awesome-icons';
import { FontAwesome } from '@/pages/public/icons/font-awesome';

@Component({
    selector: 'app-accreditation',
    imports: [Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, Step1Component, Step2Component, Step2Component, Message, EstablishmentNumberPipe],
    templateUrl: './guide-accreditation.component.html'
})
export default class GuideAccreditationComponent {
    private readonly breadcrumbService = inject(BreadcrumbService);
    protected readonly formStateService = inject(FormStateService);
    protected activeStep: number = 1;

    constructor() {
        this.breadcrumbService.setItems([{ label: 'PROCESO DE ACREDITACIÓN DE GUIANZA TURÍSTICA' }]);
    }

    protected readonly FontAwesomeIcons = FontAwesomeIcons;
    protected readonly FontAwesome = FontAwesome;
}
