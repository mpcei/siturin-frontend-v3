import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    RegistrationComponent
} from '@modules/core/roles/external/components/accreditation/steps/step3/activities/transport/registration/registration.component';
import { CatalogueProcessesTypeEnum } from '@utils/enums';

@Component({
    selector: 'app-transport',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RegistrationComponent, RegistrationComponent],
    templateUrl: './transport.component.html',
    styleUrls: ['./transport.component.scss']
})
export class TransportComponent implements OnChanges {
    @Input() processTypeCode: string = 'registration';
    @Input() classification: any;

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['classification']) {
            console.log('Clasificación recibida en TouristTransportComponent:', this.classification);
        }
    }

    protected readonly CatalogueProcessesTypeEnum = CatalogueProcessesTypeEnum;
}
