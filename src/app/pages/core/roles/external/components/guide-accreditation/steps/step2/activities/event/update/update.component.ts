import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { PeopleCapacityComponent } from '../shared/people-capacity/people-capacity.component';
import { Button } from 'primeng/button';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { PhysicalSpaceComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/park/shared/physical-space/physical-space.component';

@Component({
    selector: 'app-update',
    imports: [ PeopleCapacityComponent, Button, PhysicalSpaceComponent],
    templateUrl: './update.component.html',
    styleUrl: './update.component.scss'
})
export class UpdateComponent {
    @Output() dataOut = new EventEmitter<FormGroup>();

    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(PhysicalSpaceComponent) private info!: QueryList<PhysicalSpaceComponent>;
    @ViewChildren(PeopleCapacityComponent) private capacity!: QueryList<PeopleCapacityComponent>;

    private formBuilder = inject(FormBuilder);
    protected mainForm = this.formBuilder.group({});
    protected readonly customMessageService = inject(CustomMessageService);

    saveForm(childForm: FormGroup) {
        Object.keys(childForm.controls).forEach((name) => {
            const control = childForm.get(name);
            if (control && !this.mainForm.contains(name)) {
                this.mainForm.addControl(name, control);
            } else {
                this.mainForm.get(name)?.patchValue(control?.value);
            }
        });
    }

    onSubmit() {
        if (this.checkFormErrors()) this.dataOut.emit(this.mainForm);
    }

    checkFormErrors() {
        const errors = [...this.info.toArray().flatMap((c) => c.getFormErrors()), ...this.capacity.toArray().flatMap((c) => c.getFormErrors())];
        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }
        return true;
    }
}
