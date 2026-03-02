import { Component, inject } from '@angular/core';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { BreadcrumbService } from '@layout/service';
import { CoreSessionStorageService } from '@utils/services';
import { Step1Component } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/step1.component';
import { Step2Component } from '@modules/core/roles/external/components/guide-accreditation/steps/step2/step2.component';

@Component({
    selector: 'app-accreditation',
    imports: [Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, Step1Component, Step2Component, Step2Component],
    templateUrl: './guide-accreditation.component.html'
})
export class GuideAccreditationComponent {
    private readonly breadcrumbService = inject(BreadcrumbService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected activeStep: number = 1;

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Proceso de Acreditación de Actividades Turísticas' }]);
        console.log(this.coreSessionStorageService.establishment());
    }
}
