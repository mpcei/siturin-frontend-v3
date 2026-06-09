import { Component, inject, input, output, OutputEmitterRef } from '@angular/core';
import { RegistrationGuideComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/registration/registration-guide.component';
import { RegistrationGuideCurrentComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/registration-current/registration-guide-current.component';
import { FormStateService } from '@/pages/core/roles/external/services';
import { RegistrationGuideExpiredComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/registration-expired/registration-guide-expired.component';
import { CatalogueProcessesTypeEnum } from '@utils/enums';

@Component({
    selector: 'app-guide',
    imports: [RegistrationGuideComponent, RegistrationGuideCurrentComponent, RegistrationGuideExpiredComponent],
    templateUrl: './guide.component.html'
})
export class GuideComponent {
    public step: OutputEmitterRef<number> = output<number>();
    public processTypeCode = input.required<string>();
    protected readonly formStateService = inject(FormStateService);
    protected readonly CatalogueProcessesTypeEnum = CatalogueProcessesTypeEnum;
}
