import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services';
import { FormStateService, GuideHttpService } from '@/pages/core/roles/external/services';
import { RequirementCurrentComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/requirement-current/requirement-current.component';
import { RequirementExpiredComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/requirement-expired/requirement-expired.component';

@Component({
    selector: 'app-registration-guide-expired',
    imports: [Button, RequirementCurrentComponent, RequirementExpiredComponent],
    templateUrl: './registration-guide-expired.component.html'
})
export class RegistrationGuideExpiredComponent {
    protected readonly PrimeIcons = PrimeIcons;
    public step: OutputEmitterRef<number> = output<number>();
    private mainData: WritableSignal<Record<string, any>> = signal({});

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly guideHttpService = inject(GuideHttpService);
    protected readonly formStateService = inject(FormStateService);

    constructor() {}

    onSubmit() {
        if (this.checkFormErrors()) {
            this.saveProcess();
        }
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
    }

    saveProcess() {
        const processGuides: any[] = [];

        const formData = new FormData();

        Object.values(this.formStateService.processGuides()).forEach((x: any) => {
            processGuides.push({ requirement: x.requirement, value: x.requirement.value });

            if (x.file) formData.append(x.requirement.id, x.file);
        });

        this.formStateService.updateSection('process', { endedAt: new Date() });

        const { category, classification, ...process } = this.formStateService.process()!;

        const credentials = this.formStateService.catastroSiete()?.credentials?.map((item) => {
            return {
                classificationCode: item.classificationCode,
                startedAt: item.startedAt,
                endedAt: item.endedAt,
                protectedAreas: item.protectedAreas,
                modalities: item.modalities,
                origin: item.origin,
                code: item.code,
                geographicArea: item.geographicArea
            };
        });

        const payload = {
            user: this.formStateService.user(),
            process: process,
            establishment: this.formStateService.establishment(),
            guideOrigin: this.formStateService.guideOrigin(),
            processGuides,
            credentials
        };

        console.log(payload);
        formData.append('payload', JSON.stringify(payload));

        this.guideHttpService.createExpiredRegistration(formData).subscribe({
            next: () => {}
        });
    }

    checkFormErrors() {
        if (this.formStateService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formStateService.allErrors());
            return false;
        }

        return true;
    }

    back() {
        this.step.emit(1);
    }
}
