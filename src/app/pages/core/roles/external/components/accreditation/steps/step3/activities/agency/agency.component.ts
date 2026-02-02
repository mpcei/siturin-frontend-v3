import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
    RegistrationAgencyComponent
} from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/agency/registration/registration-agency.component';

@Component({
    selector: 'app-agency',
    imports: [RegistrationAgencyComponent],
    templateUrl: './agency.component.html',
    styleUrl: './agency.component.scss'
})
export class AgencyComponent {
    @Input() processTypeCode: string = 'registration';
}
