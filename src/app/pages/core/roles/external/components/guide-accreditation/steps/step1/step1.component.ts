import { Component, inject, OnInit, output, OutputEmitterRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { BusinessInfoComponent } from './business-info-component/business-info-component.component';
import { ContactPersonComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/contact-person/contact-person.component';
import { AddressComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/address/address.component';
import { ChildStep2FormEnum, CoreEnum } from '@utils/enums';
import { ProcessHttpService } from '@/pages/core/shared/services';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { FormStateService } from '@modules/core/roles/external/services';

@Component({
    selector: 'app-step1',
    imports: [Button, ContactPersonComponent, AddressComponent],
    templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {
    @ViewChildren(BusinessInfoComponent) private businessInfoComponent!: QueryList<BusinessInfoComponent>;
    @ViewChildren(ContactPersonComponent) private contactPersonComponent!: QueryList<ContactPersonComponent>;
    @ViewChildren(AddressComponent) private addressComponent!: QueryList<AddressComponent>;

    public step: OutputEmitterRef<number> = output<number>();
    protected step2Data = signal<any>(null);

    protected readonly PrimeIcons = PrimeIcons;

    private mainData: WritableSignal<Record<string, any>> = signal({});

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected readonly formStateService = inject(FormStateService);
    private readonly processHttpService = inject(ProcessHttpService);

    constructor() {}

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.step2Data.set(this.formStateService.formState());
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

    async onSubmit() {
        if (this.checkFormErrors()) await this.saveProcess();
    }

    checkFormErrors() {
        const errors: string[] = collectFormErrors([this.businessInfoComponent, this.contactPersonComponent, this.addressComponent]);

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    async saveProcess() {
        console.log('saveProcess', this.mainData()['establishmentAddress']);
        this.formStateService.updateSection('establishmentAddress', { ...this.mainData()['establishmentAddress'] });
        const payload = {
            ...this.mainData()
        };

        console.log(payload);
    }

    back() {
        this.step.emit(1);
    }

    protected readonly CoreEnum = CoreEnum;
    protected readonly ChildStep2FormEnum = ChildStep2FormEnum;
}
