import { Component, inject, input, OnInit, output, OutputEmitterRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { ContactPersonComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/contact-person/contact-person.component';
import { AddressComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/address/address.component';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { FormStateService, GuideHttpService } from '@modules/core/roles/external/services';
import { Message } from 'primeng/message';
import { AuthService } from '@/pages/auth/auth.service';
import { ChecklistFormComponent } from '@/pages/core/roles/guide-technician/process/checklist/checklist-form/checklist-form.component';
import { InternalInspectionService } from '@/pages/core/roles/guide-technician/process/services/internal-inspection.service';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { GuideDataComponent } from '@/pages/core/roles/guide-technician/process/checklist/guide-data/guide-data.component';

@Component({
    selector: 'app-checklist',
    imports: [Button, ContactPersonComponent, AddressComponent, Message, ChecklistFormComponent, GuideDataComponent],
    templateUrl: './checklist.component.html'
})
export class ChecklistComponent implements OnInit {
    @ViewChildren(ContactPersonComponent) private contactPersonComponent!: QueryList<ContactPersonComponent>;
    @ViewChildren(AddressComponent) private addressComponent!: QueryList<AddressComponent>;

    protected readonly PrimeIcons = PrimeIcons;
    public step: OutputEmitterRef<number> = output<number>();
    private mainData: WritableSignal<Record<string, any>> = signal({});
    public processId = input.required<string>();
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected readonly formStateService = inject(FormStateService);
    private readonly internalInspectionService = inject(InternalInspectionService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    protected guideData: any = null;
    protected checklistData: any = null;
    constructor() {
        if (!this.formStateService.user()) {
            const { birthdate, hasDisability, bloodType, phone } = this.authService.auth;
            this.formStateService.updateSection('user', {
                bloodType,
                hasDisability
            });
        }
    }

    ngOnInit() {
        this.findProcess();
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

        this.formStateService.updateSection('establishment', this.mainData()['establishment']);
        this.formStateService.updateSection('user', this.mainData()['user']);
    }

    onSubmit() {
        if (this.checkFormErrors()) this.step.emit(2);
    }

    checkFormErrors() {
        const errors: string[] = collectFormErrors([this.contactPersonComponent, this.addressComponent]);

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    back() {
        this.step.emit(1);
    }

    findProcess() {
        this.internalInspectionService.findProcess(this.processId()).subscribe({
            next: (response) => {
                this.guideData = {
                    legalName: response.establishment.ruc.legalName,
                    nationality: response.establishment.ruc.user.nationality,
                    sex: response.establishment.ruc.user.sex,
                    birthdate: response.establishment.ruc.user.birthdate,
                    hasDisability: response.establishment.ruc.user.hasDisability,
                    bloodType: response.establishment.ruc.user.bloodType,
                    phone: response.establishment.establishmentContactPerson?.phone,
                    secondaryPhone: response.establishment.establishmentContactPerson?.secondaryPhone,
                    secondaryEmail: response.establishment.establishmentContactPerson?.secondaryEmail,
                    province: response.establishment.establishmentAddress?.province,
                    canton: response.establishment.establishmentAddress?.canton,
                    parish: response.establishment.establishmentAddress?.parish,
                    mainStreet: response.establishment.establishmentAddress?.mainStreet,
                    secondaryStreet: response.establishment.establishmentAddress?.secondaryStreet,
                    numberStreet: response.establishment.establishmentAddress?.numberStreet,
                    referenceStreet: response.establishment.establishmentAddress?.referenceStreet,
                    latitude: response.establishment.establishmentAddress?.latitude,
                    longitude: response.establishment.establishmentAddress?.longitude
                };

                this.checklistData = response.processGuides;
            }
        });
    }

    createDegreesByEstablishmentId() {
        this.internalInspectionService.review(this.processId(), null).subscribe({
            next: (response) => {
                this.router.navigate([MY_ROUTES.corePages.guideTechnician.process.absolute]);
            }
        });
    }
}
