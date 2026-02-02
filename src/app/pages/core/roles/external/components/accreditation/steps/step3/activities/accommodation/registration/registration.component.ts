import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { CtcHttpService } from '@/pages/core/roles/external/services';
import { CoreSessionStorageService, CustomMessageService } from '@/utils/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { CoreEnum } from '@/utils/enums';
import { ButtonModule } from 'primeng/button';
import { GroundLocalsComponent } from '../shared/ground-locals/ground-locals.component';
import { InnactivationComponent } from '../shared/innactivation/innactivation.component';
import { InactivationComponent } from '../inactivation/inactivation.component';
import {
    EstablishmentCapabilitiesComponent
} from '../shared/establishment-capabilities/establishment-capabilities.component';
import { ComplementaryServicesComponent } from '../shared/complementary-services/complementary-services.component';

@Component({
    selector: 'app-registration',
    imports: [GroundLocalsComponent, InnactivationComponent, EstablishmentCapabilitiesComponent, ComplementaryServicesComponent, ButtonModule],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);
    protected activities: any[] = [];
    protected readonly ctcHttpService = inject(CtcHttpService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    protected mainForm!: FormGroup;

    @ViewChildren(GroundLocalsComponent) private groundLocalsComponent!: QueryList<GroundLocalsComponent>;
    @ViewChildren(InactivationComponent) private inactivationComponent!: QueryList<InactivationComponent>;
    @ViewChildren(EstablishmentCapabilitiesComponent) private establishmentCapabilitiesComponent!: QueryList<EstablishmentCapabilitiesComponent>;
    @ViewChildren(ComplementaryServicesComponent) private complementaryServicesComponent!: QueryList<ComplementaryServicesComponent>;

    constructor() {
        this.mainForm = this.formBuilder.group({});
    }

    saveForm(childForm: FormGroup): void {
        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    async onSubmit() {
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    async saveProcess() {
        const sessionData = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        const payload = {
            ...this.mainForm.value,
            ...sessionData
        };

        this.ctcHttpService.createRegistration(payload).subscribe({
            next: (response) => {
                console.log('Registro creado exitosamente:', response);
            },
            error: (error) => {
                console.error('Error al crear registro:', error);
            }
        });
    }

    checkFormErrors(): boolean {
        const errors: string[] = [
            ...this.groundLocalsComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.inactivationComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.establishmentCapabilitiesComponent.toArray().flatMap((c) => c.getFormErrors()),
            ...this.complementaryServicesComponent.toArray().flatMap((c) => c.getFormErrors())
        ];

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    ngOnInit(): void {
        this.loadStoredData();
    }

    loadStoredData(): void {}
}
