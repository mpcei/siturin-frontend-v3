import { Component, inject, output, OutputEmitterRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services';
import { FormStateService, GuideHttpService } from '@/pages/core/roles/external/services';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { AdventureTourismModalityComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/adventure-tourism-modality/adventure-tourism-modality.component';
import { RequirementComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/requirement/requirement.component';

@Component({
    selector: 'app-registration',
    imports: [Button, AdventureTourismModalityComponent, RequirementComponent],
    templateUrl: './registration-guide.component.html'
})
export class RegistrationGuideComponent {
    protected readonly PrimeIcons = PrimeIcons;
    public step: OutputEmitterRef<number> = output<number>();

    @ViewChildren(RequirementComponent) private requirementComponent!: QueryList<RequirementComponent>;
    @ViewChildren(AdventureTourismModalityComponent) private adventureTourismModalityComponent!: QueryList<AdventureTourismModalityComponent>;

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

        processGuides.push({ requirement: this.formStateService.adventureModality().requirement, value: this.formStateService.adventureModality().hasAdventureTourismModality });

        Object.values(this.formStateService.adventureModality().adventureTourismModalities).forEach((x: any) => {
            adventureModalities.push({
                modalityCode: x.modality.code,
                modalityName: x.modality.name,
                modalityCertificateCode: x.certifier.code,
                modalityCertificateName: x.certifier.name
            });

            formData.append(x.modality.code, x.file);
        });

        const payload = {
            user: this.formStateService.user(),
            process: this.formStateService.process(),
            establishment: this.formStateService.establishment(),
            processGuides: processGuides,
            adventureModalities: adventureModalities
        };

        formData.append('payload', JSON.stringify(payload));

        this.guideHttpService.createRegistration(formData).subscribe({
            next: () => {}
        });
    }

    checkFormErrors() {
        const errors: string[] = collectFormErrors([this.requirementComponent, this.adventureTourismModalityComponent]);

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
