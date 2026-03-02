import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';

@Component({
  selector: 'app-accommodation',
  imports: [RegistrationComponent],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.scss'
})
export class AccommodationComponent {
    @Input() processTypeCode: string = 'registration';
    @Output() dataOut = new EventEmitter<FormGroup>();
}
