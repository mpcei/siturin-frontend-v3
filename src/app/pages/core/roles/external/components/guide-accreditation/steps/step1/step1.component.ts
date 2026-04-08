import { Component, inject, OnInit, output, OutputEmitterRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { BusinessInfoComponent } from './business-info-component/business-info-component.component';
import { ContactPersonComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/contact-person/contact-person.component';
import { AddressComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/address/address.component';
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
        console.log(this.formStateService.establishment());
        await this.loadData();
    }

    async loadData() {
        this.step2Data.set(this.formStateService.formState());
    }

    saveForm(data: any, objectName?: string) {
        console.log(objectName, data);
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
        this.formStateService.updateSection('establishment', { ...this.mainData()['establishment'] });
        this.formStateService.updateSection('user', { ...this.mainData()['user'] });

        const payload = {
            establishment: this.formStateService.establishment(),
            user: this.formStateService.user()
        };

        console.log(payload);
    }

    back() {
        this.step.emit(1);
    }
}
