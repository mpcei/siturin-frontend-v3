import { Component, inject, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services';
import { FormStateService, GuideHttpService } from '@/pages/core/roles/external/services';
import { RequirementExpiredComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/requirement-expired/requirement-expired.component';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { MY_ROUTES } from '@routes';
import { Router } from '@angular/router';
import { AdventureTourismModalityComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/adventure-tourism-modality/adventure-tourism-modality.component';
import { LanguageComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/language/language.component';
import { ProtectedAreaComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/protected-area/protected-area.component';
import { CatalogueGuideClassificationsCodeEnum } from '@/pages/core/shared/components/regulation-simulator/enum';
import { RequirementRenewComponent } from '@/pages/core/roles/external/components/guide-accreditation/steps/step2/guide/shared/requirement-renew/requirement-renew.component';

@Component({
    selector: 'app-renew',
    imports: [Button, RequirementExpiredComponent, AdventureTourismModalityComponent, LanguageComponent, ProtectedAreaComponent, RequirementRenewComponent],
    templateUrl: './renew.component.html'
})
export class RenewComponent {
    protected readonly PrimeIcons = PrimeIcons;
    public step: OutputEmitterRef<number> = output<number>();
    private mainData: WritableSignal<Record<string, any>> = signal({});

    protected readonly router = inject(Router);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly guideHttpService = inject(GuideHttpService);
    protected readonly formStateService = inject(FormStateService);
    private readonly confirmationService = inject(ConfirmationService);

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
        this.confirmationService.confirm({
            message: `
            ¿Está seguro de gestionar el trámite: ${this.formStateService.process()?.type?.name} ante el Ministerio de Producción, Comercio Exterior
            e Inversiones? Recuerde que, una vez enviada la solicitud, esta no podrá ser modificada y estará sujeta a
            verificación`,
            header: 'GUARDAR Y FINALIZAR',
            icon: FontAwesome.ENVELOPE_SOLID,
            rejectButtonStyleClass: 'p-button-text',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'danger',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Continuar'
            },
            accept: () => {
                const processGuides: any[] = [];

                const formData = new FormData();

                Object.values(this.formStateService.processGuides()).forEach((x: any) => {
                    processGuides.push({ requirement: x.requirement, value: x.requirement.value });

                    if (x.file) formData.append(x.requirement.id, x.file);
                });

                this.formStateService.updateSection('process', { endedAt: new Date() });

                const { ...process } = this.formStateService.process()!;

                const payload = {
                    user: this.formStateService.user(),
                    process: process,
                    establishment: this.formStateService.establishment(),
                    processGuides,
                    credential: this.formStateService.currentCredential()
                };

                console.log(payload);
                formData.append('payload', JSON.stringify(payload));

                this.guideHttpService.createRenew(formData).subscribe({
                    next: () => {
                        this.router.navigate([MY_ROUTES.corePages.external.guideEstablishment.absolute]);
                    }
                });
            },
            key: 'confirmdialog'
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

    protected readonly CatalogueGuideClassificationsCodeEnum = CatalogueGuideClassificationsCodeEnum;
}
