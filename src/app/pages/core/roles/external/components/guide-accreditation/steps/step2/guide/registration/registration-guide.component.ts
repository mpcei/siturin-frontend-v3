import { Component, inject, output, OutputEmitterRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { PhysicalSpaceComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/agency/shared/physical-space/physical-space.component';
import { AccreditedStaffLanguageComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/agency/shared/accredited-staff-language/accredited-staff-language.component';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services';
import { TouristGuideComponent } from '@/pages/core/shared';
import { AdventureTourismModalityComponent } from '@/pages/core/shared/components/adventure-tourism-modality/adventure-tourism-modality.component';
import { Fluid } from 'primeng/fluid';
import { SalesRepresentativeComponent } from '@/pages/core/shared/components/sales-representative/sales-representative.component';
import { TouristTransportCompanyComponent } from '@/pages/core/shared/components/tourist-transport-company/tourist-transport-company.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { AgencyHttpService, FormStateService } from '@/pages/core/roles/external/services';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';

@Component({
    selector: 'app-registration',
    imports: [PhysicalSpaceComponent, AccreditedStaffLanguageComponent, Button, TouristGuideComponent, AdventureTourismModalityComponent, Fluid, SalesRepresentativeComponent, TouristTransportCompanyComponent, RegulationComponent],
    templateUrl: './registration-guide.component.html'
})
export class RegistrationGuideComponent {
    protected readonly PrimeIcons = PrimeIcons;
    public step: OutputEmitterRef<number> = output<number>();

    @ViewChildren(AccreditedStaffLanguageComponent) private accreditedStaffLanguageComponent!: QueryList<AccreditedStaffLanguageComponent>;
    @ViewChildren(PhysicalSpaceComponent) private physicalSpaceComponent!: QueryList<PhysicalSpaceComponent>;
    @ViewChildren(AdventureTourismModalityComponent) private adventureTourismModalityComponent!: QueryList<AdventureTourismModalityComponent>;
    @ViewChildren(TouristGuideComponent) private touristGuideComponent!: QueryList<TouristGuideComponent>;
    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    private mainData: WritableSignal<Record<string, any>> = signal({});

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly agencyHttpService = inject(AgencyHttpService);
    protected readonly formStateService = inject(FormStateService);

    constructor() {
        // effect(async () => {
        //     const processSignal = this.formStateService.process();
        //
        //     if (processSignal) {
        //         if (processSignal.classification?.hasRegulation) this.modelId = processSignal.classification.id;
        //         if (processSignal.category?.hasRegulation) this.modelId = processSignal.category.id;
        //     }
        // });
    }

    saveForm(data: any, objectName?: string) {
        this.mainData.update((currentData) => {
            let newData = { ...currentData };

            if (objectName) {
                newData[objectName] = {
                    ...(newData[objectName] ?? {}),
                    ...data
                };
            } else {
                newData = { ...currentData, ...data };
            }

            return newData;
        });

        this.formStateService.updateSection('process', this.mainData()['process']);
    }

    onSubmit() {
        if (this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess() {
        this.agencyHttpService.createRegistration(this.formStateService.formState()).subscribe({
            next: () => {}
        });
    }

    checkFormErrors() {
        const errors: string[] = collectFormErrors([this.accreditedStaffLanguageComponent, this.physicalSpaceComponent, this.adventureTourismModalityComponent, this.touristGuideComponent, this.regulationComponent]);

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    back() {
        this.step.emit(1);
    }
}
