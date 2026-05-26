import { Component, input, Input, output, OutputEmitterRef } from '@angular/core';
import { RegistrationGuideComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/registration/registration-guide.component';
import {
    RegistrationGuideCurrentComponent
} from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/registration-current/registration-guide-current.component';

@Component({
    selector: 'app-guide',
    imports: [RegistrationGuideComponent, RegistrationGuideCurrentComponent],
    templateUrl: './guide.component.html'
})
export class GuideComponent {
    public step: OutputEmitterRef<number> = output<number>();
    public processTypeCode = input.required<string>();
}
