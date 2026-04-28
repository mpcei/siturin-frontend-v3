import { Component, inject, output, OutputEmitterRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services';
import { FormStateService, GuideHttpService } from '@/pages/core/roles/external/services';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { AdventureTourismModalityComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/adventure-tourism-modality/adventure-tourism-modality.component';
import { RequirementComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/requirement/requirement.component';
import { ProtectedAreaComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/protected-area/protected-area.component';
import { LanguageComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/language/language.component';

@Component({
    selector: 'app-registration',
    imports: [Button, AdventureTourismModalityComponent, RequirementComponent, ProtectedAreaComponent, LanguageComponent],
    templateUrl: './registration-guide.component.html'
})
export class RegistrationGuideComponent {
    protected readonly PrimeIcons = PrimeIcons;
    public step: OutputEmitterRef<number> = output<number>();

    @ViewChildren(RequirementComponent) private requirementComponent!: QueryList<RequirementComponent>;
    @ViewChildren(ProtectedAreaComponent) private protectedAreaComponent!: QueryList<ProtectedAreaComponent>;
    @ViewChildren(AdventureTourismModalityComponent) private adventureTourismModalityComponent!: QueryList<AdventureTourismModalityComponent>;
    @ViewChildren(LanguageComponent) private languageComponent!: QueryList<LanguageComponent>;

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
        if (objectName?.includes('language')) this.formStateService.updateSection('language', this.mainData()[objectName]);
        if (objectName?.includes('protectedArea')) this.formStateService.updateSection('protectedArea', this.mainData()[objectName]);

        console.log(this.formStateService.protectedArea());
    }

    onSubmit() {
        if (this.checkFormErrors()) {
            this.saveProcess();
        }
    }

    saveProcess() {
        const processGuides: any[] = [];
        const adventureModalities: any[] = [];
        const languages: any[] = [];
        const protectedAreas: any[] = [];

        const formData = new FormData();

        Object.values(this.formStateService.processGuides()).forEach((x: any) => {
            processGuides.push({ requirement: x.requirement, value: x.requirement.value });

            formData.append(x.requirement.id, x.file);
        });

        if (this.formStateService.protectedArea()) {
            processGuides.push({ requirement: this.formStateService.protectedArea().requirement, value: this.formStateService.protectedArea().hasProtectedArea });

            Object.values(this.formStateService.protectedArea().protectedAreas).forEach((x: any) => {
                protectedAreas.push({
                    areaCode: x.area?.code,
                    areaName: x.area?.name,
                    province: x.province,
                    canton: x.canton
                });
            });
        }

        if (this.formStateService.adventureModality()) {
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
        }

        if (this.formStateService.language()) {
            processGuides.push({ requirement: this.formStateService.language().requirement, value: this.formStateService.language().hasLanguage });

            Object.values(this.formStateService.language().languages).forEach((x: any) => {
                languages.push({
                    languageCode: x.language.code,
                    languageName: x.language.name,
                    levelCode: x.level.code,
                    levelName: x.level.name
                });

                formData.append(x.language.code, x.file);
            });
        }

        const payload = {
            user: this.formStateService.user(),
            process: this.formStateService.process(),
            establishment: this.formStateService.establishment(),
            processGuides: processGuides,
            adventureModalities: adventureModalities,
            languages: languages,
            protectedAreas: protectedAreas
        };

        formData.append('payload', JSON.stringify(payload));

        this.guideHttpService.createRegistration(formData).subscribe({
            next: () => {}
        });
    }

    checkFormErrors() {
        const errors: string[] = collectFormErrors([this.requirementComponent, this.protectedAreaComponent, this.adventureTourismModalityComponent, this.languageComponent]);

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
