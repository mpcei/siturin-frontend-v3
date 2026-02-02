import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FluidModule } from 'primeng/fluid';
import { DividerModule } from 'primeng/divider';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { PeopleCapacityComponent } from "./shared/people-capacity/people-capacity.component";
import { CustomMessageService } from '@/utils/services';

@Component({
    selector:'app-park',
    imports: [
    PanelModule,
    FluidModule,
    DividerModule,
    ButtonModule,
    PeopleCapacityComponent
],
    templateUrl: './park.component.html',
    styleUrl: './park.component.scss'
})
export class ParkComponent {
    protected readonly PrimeIcons = PrimeIcons;

   
    @ViewChildren(PeopleCapacityComponent) private peopleCapacityComponent!: QueryList<PeopleCapacityComponent>;

    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;

    @Output() dataOut = new EventEmitter<FormGroup>();


    protected readonly customMessageService = inject(CustomMessageService);

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
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    loadData(){}

}
