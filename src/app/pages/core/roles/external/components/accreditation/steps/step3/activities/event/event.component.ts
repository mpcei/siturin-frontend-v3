import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreSessionStorageService } from '@utils/services';
import { CatalogueProcessesTypeEnum } from '@utils/enums';
import { RegistrationComponent } from './registration/registration.component';

@Component({
    selector: 'app-event',
    standalone: true,
    imports: [RegistrationComponent, CommonModule],
    templateUrl: './event.component.html',
    styleUrl: './event.component.scss'
})
export class EventComponent {
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Input() processTypeCode: string = 'registration';

    private readonly coreSessionStorageService = inject(CoreSessionStorageService);

    constructor() {}

    protected readonly CatalogueProcessesTypeEnum = CatalogueProcessesTypeEnum;
}
