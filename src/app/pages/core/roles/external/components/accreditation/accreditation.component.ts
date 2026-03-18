import { Component, inject } from '@angular/core';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { Step1Component } from '@modules/core/roles/external/components/accreditation/steps/step1/step1.component';
import { Step2Component } from '@modules/core/roles/external/components/accreditation/steps/step2/step2.component';
import { Step3Component } from '@modules/core/roles/external/components/accreditation/steps/step3/step3.component';
import { BreadcrumbService } from '@layout/service';
import { CoreSessionStorageService } from '@utils/services';
import { FormStateService } from '@modules/core/roles/external/services';

@Component({
    selector: 'app-accreditation',
    imports: [Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, Step1Component, Step2Component, Step3Component],
    templateUrl: './accreditation.component.html'
})
export class AccreditationComponent {
    private readonly breadcrumbService = inject(BreadcrumbService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected readonly formStateService = inject(FormStateService);
    protected activeStep: number = 1;

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Proceso de Acreditación de Actividades Turísticas' }]);
        console.log(this.coreSessionStorageService.establishment());
        console.log(this.formStateService.process());
    }
}
