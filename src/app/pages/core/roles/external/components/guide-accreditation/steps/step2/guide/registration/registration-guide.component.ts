import { Component, inject, output, OutputEmitterRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { PhysicalSpaceComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/physical-space/physical-space.component';
import { AccreditedStaffLanguageComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/agency/shared/accredited-staff-language/accredited-staff-language.component';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services';
import { TouristGuideComponent } from '@/pages/core/shared';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { FormStateService, GuideHttpService } from '@/pages/core/roles/external/services';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { AdventureTourismModalityComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/adventure-tourism-modality/adventure-tourism-modality.component';

@Component({
    selector: 'app-registration',
    imports: [PhysicalSpaceComponent, Button, AdventureTourismModalityComponent],
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
    protected readonly guideHttpService = inject(GuideHttpService);
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

        if (objectName?.includes('processGuides')) this.formStateService.updateSection('processGuides', this.mainData()[objectName]);
        if (objectName?.includes('adventureModality')) this.formStateService.updateSection('adventureModality', this.mainData()[objectName]);
    }

    onSubmit() {
        if (this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess() {
        const processGuides: any[] = [];
        const adventureModalities: any[] = [];

        const formData = new FormData();

        Object.values(this.formStateService.processGuides()).forEach((x: any) => {
            processGuides.push({ requirement: x.requirement, value: '1' });

            formData.append(x.requirement.id, x.file);
        });

        // processGuides.push({ requirement: x.requirement, value: '1' });

        Object.values(this.formStateService.adventureModality().adventureTourismModalities).forEach((x: any) => {
            adventureModalities.push({
                modalityCode: x.type.code,
                modalityName: x.type.name,
                modalityCertificateCode: x.certifier.code,
                modalityCertificateName: x.certifier.name
            });

            formData.append(x.type.code, x.file);
        });

        const payload = {
            user: this.formStateService.user(),
            process: this.formStateService.process(),
            establishment: this.formStateService.establishment(),
            processGuides: processGuides
        };

        formData.append('payload', JSON.stringify(payload));
        this.guideHttpService.createRegistration(formData).subscribe({
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
