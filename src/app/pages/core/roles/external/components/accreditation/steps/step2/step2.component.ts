import { Component, EventEmitter, inject, OnInit, output, Output, OutputEmitterRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { BusinessInfoComponent } from './business-info-component/business-info-component.component';
import { StaffComponent } from '@modules/core/roles/external/components/accreditation/steps/step2/staff/staff.component';
import { ContactPersonComponent } from '@modules/core/roles/external/components/accreditation/steps/step2/contact-person/contact-person.component';
import { Fluid } from 'primeng/fluid';
import { AddressComponent } from '@modules/core/roles/external/components/accreditation/steps/step2/address/address.component';
import { ChildStep2FormEnum, CoreEnum } from '@utils/enums';
import { ProcessHttpService } from '@/pages/core/shared/services';

@Component({
    selector: 'app-step2',
    imports: [Button, BusinessInfoComponent, StaffComponent, ContactPersonComponent, Fluid, AddressComponent],
    templateUrl: './step2.component.html',
    styleUrl: './step2.component.scss'
})
export class Step2Component implements OnInit {
    @ViewChildren(BusinessInfoComponent) private businessInfoComponent!: QueryList<BusinessInfoComponent>;
    @ViewChildren(ContactPersonComponent) private contactPersonComponent!: QueryList<ContactPersonComponent>;
    @ViewChildren(StaffComponent) private staffComponent!: QueryList<StaffComponent>;
    @ViewChildren(AddressComponent) private addressComponent!: QueryList<AddressComponent>;

    public step: OutputEmitterRef<number> = output<number>();
    protected step2Data = signal<any>(null);

    protected readonly PrimeIcons = PrimeIcons;

    private mainData: WritableSignal<Record<string, any>> = signal({});

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly processHttpService = inject(ProcessHttpService);

    constructor() {
        this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, {
            processId: '6f32b01d-c0be-47fe-b896-90b38b91c498',
            establishmentId: '9aa53a63-3546-4e08-ae7f-e8d14c77a01a'
        });
    }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.step2Data.set(await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step2));
    }

    protected saveForm(data: any, objectName?: string) {
        this.mainData.update((currentData) => {
            let newData = { ...currentData };

            if (objectName) {
                // Actualiza una sub-propiedad de forma inmutable
                newData[objectName] = {
                    ...(newData[objectName] ?? {}),
                    ...data
                };
            } else {
                // Actualiza el objeto principal
                newData = { ...currentData, ...data };
            }

            return newData;
        });
    }

    onSubmit() {
        if (this.checkFormErrors()) this.saveProcess();
    }

    checkFormErrors() {
        const errors: string[] = [
            ...this.businessInfoComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.contactPersonComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.staffComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.addressComponent.toArray().flatMap((c) => c.getFormErrors())
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    async saveProcess() {
        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.step2, { ...this.mainData() });

        const { processId, establishmentId } = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        const payload = {
            ...this.mainData(),
            establishmentId,
            processId
        };

        this.processHttpService.createStep2(payload).subscribe({
            next: () => {
                this.step.emit(3);
            }
        });
    }

    back() {
        this.step.emit(1);
    }

    protected readonly CoreEnum = CoreEnum;
    protected readonly ChildStep2FormEnum = ChildStep2FormEnum;
}
