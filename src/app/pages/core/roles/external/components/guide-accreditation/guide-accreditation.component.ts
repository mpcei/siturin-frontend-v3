import { Component, inject, OnInit } from '@angular/core';
import { Step, StepList, StepPanel, StepPanels, Stepper } from 'primeng/stepper';
import { FormsModule } from '@angular/forms';
import { BreadcrumbService } from '@layout/service';
import { Step1Component } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/step1.component';
import { Step2Component } from '@modules/core/roles/external/components/guide-accreditation/steps/step2/step2.component';
import { FormStateService, GuideHttpService } from '@modules/core/roles/external/services';
import { Message } from 'primeng/message';
import { EstablishmentNumberPipe } from '@/pages/core/shared/pipes';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { AuthService } from '@/pages/auth/auth.service';
import { format, isAfter } from 'date-fns';

@Component({
    selector: 'app-accreditation',
    imports: [Stepper, StepList, Step, StepPanels, StepPanel, FormsModule, Step1Component, Step2Component, Message, EstablishmentNumberPipe],
    templateUrl: './guide-accreditation.component.html'
})
export default class GuideAccreditationComponent implements OnInit {
    private readonly breadcrumbService = inject(BreadcrumbService);
    protected readonly authService = inject(AuthService);
    protected readonly formStateService = inject(FormStateService);
    protected readonly guideHttpService = inject(GuideHttpService);
    protected readonly FontAwesome = FontAwesome;
    protected activeStep: number = 1;

    constructor() {
        this.breadcrumbService.setItems([{ label: 'PROCESO DE ACREDITACIÓN DE GUIANZA TURÍSTICA' }]);
    }
    ngOnInit(): void {
        this.findGuidesSiete();
    }

    findGuidesSiete() {
        this.guideHttpService.findGuidesSiete(this.authService.auth.identification!).subscribe({
            next: (response) => {
                let type = 'new';

                if (response.length > 0) {
                    type = response.some((item) => isAfter(new Date(item.fecha_caducidad_licencia), new Date())) ? 'current' : 'expired';
                }

                this.formStateService.updateSection('catastroSiete', { credentials: response, type });

                this.formStateService.updateSection('guideOrigin', { province: response[0].provincia, canton: response[0].canton, languages: response[0].idiomas});
            }
        });
    }
}
