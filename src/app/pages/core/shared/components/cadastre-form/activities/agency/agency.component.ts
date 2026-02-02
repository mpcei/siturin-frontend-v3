import { Component, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { FluidModule } from 'primeng/fluid';
import { DividerModule } from 'primeng/divider';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TouristGuideComponent } from "./shared/tourist-guide/tourist-guide.component";
import { TouristTransportCompanyComponent } from "./shared/tourist-transport-company/tourist-transport-company.component";
import { SalesRepresentativeComponent } from "./shared/sales-representative/sales-representative.component";
import { CustomMessageService } from '@/utils/services';

@Component({
    selector: 'app-agency',
    imports: [
    PanelModule,
    FluidModule,
    DividerModule,
    ButtonModule,
    TouristGuideComponent,
    TouristTransportCompanyComponent,
    SalesRepresentativeComponent
],
    templateUrl: './agency.component.html',
    styleUrl: './agency.component.scss'
})
export class AgencyComponent {
    protected readonly PrimeIcons = PrimeIcons;

    @ViewChildren(SalesRepresentativeComponent) private salesRepresentativeComponent!: QueryList<SalesRepresentativeComponent>;
    @ViewChildren(TouristGuideComponent) private touristGuideComponent!: QueryList<TouristGuideComponent>;
    @ViewChildren(TouristTransportCompanyComponent) private TouristTransportCompanyComponent!: QueryList<TouristTransportCompanyComponent>;
    
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
            ...this.salesRepresentativeComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.touristGuideComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.TouristTransportCompanyComponent.toArray().flatMap((c) => c.getFormErrors()),
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    loadData(){}

}
