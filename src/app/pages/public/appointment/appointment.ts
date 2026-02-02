import { Component, effect, inject, OnInit, QueryList, signal, ViewChildren, WritableSignal } from '@angular/core';
import { CoreEnum } from '@utils/enums';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { AppointmentForm } from '@/pages/public/appointment/appointment-form/appointment-form';
import { AppointmentHttpService } from '@/pages/public/appointment/services';
import { Button } from 'primeng/button';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FontAwesome } from '@/api/font-awesome';

@Component({
    selector: 'app-registration',
    standalone: true,
    imports: [AppointmentForm, Button, ReactiveFormsModule],
    templateUrl: './appointment.html',
    styleUrl: './appointment.scss'
})
export class Appointment implements OnInit {
    submitted = signal(false);
    protected readonly CoreEnum = CoreEnum;

    protected mainData: WritableSignal<Record<string, any>> = signal({});
    protected modelId?: string;
    protected dataIn!: any;
    protected readonly environment = environment;
    @ViewChildren(AppointmentForm) private appointmentForm!: QueryList<AppointmentForm>;
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly appointmentHttpService = inject(AppointmentHttpService);
    private readonly customMessageService = inject(CustomMessageService);

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

    ladingPage(){
        window.location.href = "https://www.francis-nails.com";
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

    private async loadDataIn() {
        this.dataIn = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step3);
    }

    private async saveProcess() {
        this.submitted.update(v => false);
        //TODO service
        this.submitted.update(v => true);

        this.customMessageService.showModalInfo({
            summary:`Servicio: ${this.mainData()['service']}`,
            detail:`Fecha: ${format(this.mainData()['date'],'EEEE dd MMMM yyyy HH:mm', { locale: es })}`
        }
        )
    }

    private checkFormErrors() {
        const errors = collectFormErrors([this.appointmentForm]);

        if (errors.length) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    protected readonly FontAwesome = FontAwesome;
}
