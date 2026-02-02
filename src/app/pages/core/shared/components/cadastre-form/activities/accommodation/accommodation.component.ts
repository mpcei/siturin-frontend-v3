import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FluidModule } from 'primeng/fluid';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@/utils/services';
import { ComplementaryServicesComponent } from './shared/complementary-services/complementary-services.component';
import {
    EstablishmentCapabilitiesComponent
} from './shared/establishment-capabilities/establishment-capabilities.component';
import { GroundLocalsComponent } from './shared/ground-locals/ground-locals.component';

//import { ComplementaryServices } from "./shared/complementary-services/complementary-services";

@Component({
    selector: 'app-accommodation',
    imports: [
        ReactiveFormsModule,
        SelectModule,
        DividerModule,
        PanelModule,
        FluidModule,
        InputTextModule,
        InputNumberModule,
        CardModule,
        TagModule,
        ButtonModule,
        ComplementaryServicesComponent,
        EstablishmentCapabilitiesComponent,
        GroundLocalsComponent
    ],
    templateUrl: './accommodation.component.html',
    styleUrl: './accommodation.component.scss'
})
export class AccommodationComponent {
    protected readonly PrimeIcons = PrimeIcons;
    @Output() dataOut = new EventEmitter<FormGroup>();

    @ViewChildren(EstablishmentCapabilitiesComponent) private establishmentCapabilitiesComponent!: QueryList<EstablishmentCapabilitiesComponent>;
    @ViewChildren(ComplementaryServicesComponent) private complementaryServicesComponent!: QueryList<ComplementaryServicesComponent>;
    @ViewChildren(GroundLocalsComponent) private groundLocalsComponent!: QueryList<GroundLocalsComponent>;
    private formBuilder = inject(FormBuilder);

    protected mainForm!: FormGroup;

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
            ...this.establishmentCapabilitiesComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.groundLocalsComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.complementaryServicesComponent.toArray().flatMap((c) => c.getFormErrors())
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    loadData() {}
}
