import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PeopleCapacityComponent } from "../park/shared/people-capacity/people-capacity.component";
import { CustomMessageService } from '@/utils/services';

@Component({
    selector: 'app-event',
    imports: [
    FluidModule,
    PanelModule,
    DividerModule,
    ButtonModule,
    PeopleCapacityComponent
],
    templateUrl: './event.component.html',
    styleUrl: './event.component.scss'
})
export class EventComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(PeopleCapacityComponent) private peopleCapacityComponent!: QueryList<PeopleCapacityComponent>;
   

    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;

    protected readonly customMessageService = inject(CustomMessageService);

    @Output() dataOut = new EventEmitter<FormGroup>();

     constructor() {
        this.mainForm = this.formBuilder.group({});
    }

    saveForm(childForm: FormGroup) {
         Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        }); 

    }

    onSubmit() {
        if (!this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess() {
        console.log(this.mainForm.value);
    }

    checkFormErrors() {
        const errors: string[] = [
            ...this.peopleCapacityComponent.toArray().flatMap((c) => c.getFormErrors()),
        ];

        if (errors.length > 0) {
            //this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    loadData(){}

}
