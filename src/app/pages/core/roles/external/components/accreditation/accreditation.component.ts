import { Component, inject } from '@angular/core';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { Step1Component } from '@modules/core/roles/external/components/accreditation/steps/step1/step1.component';
import { Step2Component } from '@modules/core/roles/external/components/accreditation/steps/step2/step2.component';
import { Step3Component } from '@modules/core/roles/external/components/accreditation/steps/step3/step3.component';
import { BreadcrumbService } from '@layout/service';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-accreditation',
    imports: [Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, Step1Component, Step2Component, Step3Component, Fluid],
    templateUrl: './accreditation.component.html',
    styleUrl: './accreditation.component.scss'
})
export class AccreditationComponent {
    private readonly _breadcrumbService = inject(BreadcrumbService);
    protected activeStep: number = 1;

    constructor() {
        this._breadcrumbService.setItems([{ label: 'Proceso de Acreditación de Actividades Turísticas' }]);
    }
}
