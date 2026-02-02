import { Component, Input } from '@angular/core';
import {
    RegistrationComponent
} from '@modules/core/roles/external/components/accreditation/steps/step3/activities/ctc/registration/registration.component';

@Component({
    selector: 'app-ctc',
    imports: [RegistrationComponent, RegistrationComponent],
    templateUrl: './ctc.component.html',
    styleUrl: './ctc.component.scss'
})
export class CtcComponent {
    @Input() processTypeCode: string = 'registration';
}
