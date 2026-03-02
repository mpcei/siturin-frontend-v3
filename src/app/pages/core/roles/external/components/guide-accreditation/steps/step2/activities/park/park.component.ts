import { Component, inject, Input } from '@angular/core';
import { RegistrationComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/park/registration/registration.component';
import { ReclassificationComponent } from './reclassification/reclassification.component';
import { ReadmissionComponent } from './readmission/readmission.component';
import { UpdateComponent } from './update/update.component';
import { CommonModule } from '@angular/common';
import { CoreSessionStorageService } from '@utils/services';
import { CatalogueProcessesTypeEnum } from '@utils/enums';

@Component({
    selector: 'app-park',
    standalone: true,
    imports: [RegistrationComponent, ReclassificationComponent, ReadmissionComponent, UpdateComponent, CommonModule],
    templateUrl: './park.component.html',
    styleUrl: './park.component.scss'
})
export class ParkComponent {
    @Input() processTypeCode: string = 'registration';

    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected readonly CatalogueProcessesTypeEnum = CatalogueProcessesTypeEnum;

    constructor() {}
}
