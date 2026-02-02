import { Component, effect, inject, OnInit, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { Button } from 'primeng/button';
import { PrimeIcons } from 'primeng/api';
import { ChildParkFormEnum, CoreEnum } from '@utils/enums';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { PeopleCapacityComponent } from '../shared/people-capacity/people-capacity.component';
import { PhysicalSpaceComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/park/shared/physical-space/physical-space.component';
import { RegulationComponent } from '@/pages/core/shared/components/regulation/regulation.component';
import { ParkHttpService } from '@modules/core/roles/external/services/park-http.service';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { Fluid } from 'primeng/fluid';

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [Button, PeopleCapacityComponent, PhysicalSpaceComponent, RegulationComponent, Fluid],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss'
})
export class RegistrationComponent implements OnInit {
    @ViewChildren(PhysicalSpaceComponent) private physicalSpaceComponent!: QueryList<PhysicalSpaceComponent>;
    @ViewChildren(PeopleCapacityComponent) private peopleCapacityComponent!: QueryList<PeopleCapacityComponent>;
    @ViewChildren(RegulationComponent) private regulationComponent!: QueryList<RegulationComponent>;

    protected readonly CoreEnum = CoreEnum;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly parksHttpService = inject(ParkHttpService);
    private readonly customMessageService = inject(CustomMessageService);

    private mainData: WritableSignal<Record<string, any>> = signal({});
    protected modelId?: string;

    protected dataIn!: any;
    protected loadedDataIn: boolean = false;

    constructor() {
        effect(async () => {
            const process = this.coreSessionStorageService.processSignal();

            if (!process) return;

            const candidates = [process.classification, process.category];
            const regulated = candidates.find((c) => c?.hasRegulation);

            if (regulated) {
                this.modelId = regulated.id;
            }
        });
    }

    async ngOnInit(): Promise<void> {
        await this.loadDataIn();
    }

    private async loadDataIn() {
        this.loadedDataIn = false;
        this.dataIn = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step3);
        this.loadedDataIn = true;
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

    protected async onSubmit() {
        if (this.checkFormErrors()) {
            await this.saveProcess();
        }
    }

    private async saveProcess() {
        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.step3, this.mainData());

        const process = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        console.log(await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step3));

        const payload = { ...this.mainData(), ...process };

        this.parksHttpService.createRegistration(payload).subscribe({
            next: () => {}
        });
    }

    private checkFormErrors() {
        const errors = collectFormErrors([this.physicalSpaceComponent, this.peopleCapacityComponent, this.regulationComponent]);

        if (errors.length) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }
}
