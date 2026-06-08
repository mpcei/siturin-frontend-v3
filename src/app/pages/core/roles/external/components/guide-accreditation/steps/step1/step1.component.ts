import { Component, inject, OnInit, output, OutputEmitterRef, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { ContactPersonComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/contact-person/contact-person.component';
import { AddressComponent } from '@modules/core/roles/external/components/guide-accreditation/steps/step1/address/address.component';
import { ProcessHttpService } from '@/pages/core/shared/services';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { EstablishmentHttpService, FormStateService, GuideHttpService } from '@modules/core/roles/external/services';
import { Message } from 'primeng/message';
import { AuthService } from '@/pages/auth/auth.service';

@Component({
    selector: 'app-step1',
    imports: [Button, ContactPersonComponent, AddressComponent, Message],
    templateUrl: './step1.component.html'
})
export class Step1Component implements OnInit {
    @ViewChildren(ContactPersonComponent) private contactPersonComponent!: QueryList<ContactPersonComponent>;
    @ViewChildren(AddressComponent) private addressComponent!: QueryList<AddressComponent>;

    protected readonly PrimeIcons = PrimeIcons;
    public step: OutputEmitterRef<number> = output<number>();
    private mainData: WritableSignal<Record<string, any>> = signal({});

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected readonly formStateService = inject(FormStateService);
    private readonly establishmentHttpService = inject(EstablishmentHttpService);
    private readonly guideHttpService = inject(GuideHttpService);
    private readonly authService = inject(AuthService);

    protected professionalTitles = signal<any[]>([]);

    constructor() {
        console.log(this.formStateService.user());
        console.log(this.authService.auth);
        console.log(!this.formStateService.user());
        if (!this.formStateService.user()) {

            this.formStateService.updateSection('user', {
                ...this.authService.auth
            });
        }
        console.log(this.formStateService.user());
    }

    ngOnInit() {
        this.createDegreesByEstablishmentId();
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
        console.log(this.formStateService.catastroSiete());

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

    findDegreesByEstablishmentId() {
        this.guideHttpService.findProfessionalTitlesByEstablishmentId(this.formStateService?.establishment()?.id!).subscribe({
            next: (response) => {
                this.professionalTitles.set(response);
                this.formStateService.updateSection('degrees', response);
            }
        });
    }

    createDegreesByEstablishmentId() {
        this.guideHttpService.createProfessionalTitles(this.authService?.auth?.identification!, this.formStateService?.establishment()?.id!).subscribe({
            // this.guideHttpService.createProfessionalTitles('1724909443', this.formStateService?.establishment()?.id!).subscribe({
            next: (response) => {
                this.findDegreesByEstablishmentId();
                this.formStateService.updateSection('degrees', response);
            }
        });
    }
}
