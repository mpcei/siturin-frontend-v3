import { Component, Input, output, OutputEmitterRef } from '@angular/core';
import { RegistrationGuideComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/registration/registration-guide.component';

@Component({
    selector: 'app-guide',
    imports: [RegistrationGuideComponent],
    templateUrl: './guide.component.html'
})
export class GuideComponent {
    public step: OutputEmitterRef<number> = output<number>();
    @Input() processTypeCode: string = 'registration';
}
