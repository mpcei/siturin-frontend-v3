import { Component, effect, EventEmitter, inject, Output, QueryList, ViewChildren } from '@angular/core';
import { PhysicalSpaceComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/agency/shared/physical-space/physical-space.component';
import { AccreditedStaffLanguageComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/agency/shared/accredited-staff-language/accredited-staff-language.component';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { TouristGuideComponent } from '@modules/core/shared';
import { AdventureTourismModalityComponent } from '@modules/core/shared/components/adventure-tourism-modality/adventure-tourism-modality.component';
import { Fluid } from 'primeng/fluid';
import { SalesRepresentativeComponent } from '@/pages/core/shared/components/sales-representative/sales-representative.component';
import { TouristTransportCompanyComponent } from '@/pages/core/shared/components/tourist-transport-company/tourist-transport-company.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { CoreEnum } from '@utils/enums';
import { AgencyHttpService } from '@/pages/core/roles/external/services';

@Component({
    selector: 'app-registration',
    imports: [PhysicalSpaceComponent, AccreditedStaffLanguageComponent, Button, TouristGuideComponent, AdventureTourismModalityComponent, Fluid, SalesRepresentativeComponent, TouristTransportCompanyComponent, RegulationComponent],
    templateUrl: './registration-agency.component.html',
    styleUrl: './registration-agency.component.scss'
})
export class RegistrationAgencyComponent {
    protected readonly PrimeIcons = PrimeIcons;
    @Output() step: EventEmitter<number> = new EventEmitter<number>();

    @ViewChildren(AccreditedStaffLanguageComponent) private accreditedStaffLanguageComponent!: QueryList<AccreditedStaffLanguageComponent>;
    @ViewChildren(PhysicalSpaceComponent) private physicalSpaceComponent!: QueryList<PhysicalSpaceComponent>;
    @ViewChildren(AdventureTourismModalityComponent) private adventureTourismModalityComponent!: QueryList<AdventureTourismModalityComponent>;
    @ViewChildren(TouristGuideComponent) private touristGuideComponent!: QueryList<TouristGuideComponent>;
    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    private mainData: Record<string, any> = {};
    protected modelId!: string | undefined;

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected readonly agencyHttpService = inject(AgencyHttpService);

    constructor() {
        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
                if (processSignal.classification?.hasRegulation) this.modelId = processSignal.classification.id;
                if (processSignal.category?.hasRegulation) this.modelId = processSignal.category.id;
            }
        });
    }

    saveForm(data: any, objectName?: string) {
        if (objectName) {
            if (!this.mainData[objectName]) {
                this.mainData[objectName] = {};
            }

            this.mainData[objectName] = { ...this.mainData[objectName], ...data };
        } else {
            this.mainData = { ...this.mainData, ...data };
        }
    }

    async onSubmit() {
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    async saveProcess() {
        const sessionData = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        const payload = { ...this.mainData, ...sessionData };

        this.agencyHttpService.createRegistration(payload).subscribe({
            next: () => {}
        });
    }

    checkFormErrors() {
        const errors: string[] = [
            ...this.accreditedStaffLanguageComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.physicalSpaceComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.adventureTourismModalityComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.touristGuideComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.regulationComponent.toArray().flatMap((c) => c.getFormErrors())
        ];

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
