import { Component, EventEmitter, effect, inject, input, OnInit, Output, QueryList, signal, ViewChildren } from '@angular/core';
import { PrimeIcons } from 'primeng/api';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CoreSessionStorageService, CustomMessageService } from '@utils/services';
import { JuridicalPersonComponent } from '@modules/core/roles/external/components/accreditation/steps/step1/juridical-person/juridical-person.component';
import { Button } from 'primeng/button';
import { Fluid } from 'primeng/fluid';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { SriComponent } from '@modules/core/shared/components/sri/sri.component';
import { CoreEnum } from '@utils/enums';
import { collectFormErrors } from '@utils/helpers/collect-form-errors.helper';
import { ProcessHttpService } from '@/pages/core/shared/services';

@Component({
    selector: 'app-step1',
    imports: [JuridicalPersonComponent, Button, Fluid, SriComponent],
    templateUrl: './step1.component.html',
    styleUrl: './step1.component.scss'
})
export class Step1Component implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly router = inject(Router);

    @Output() step: EventEmitter<number> = new EventEmitter<number>();
    @ViewChildren(JuridicalPersonComponent) private juridicalPersonComponent!: QueryList<JuridicalPersonComponent>;

    private formBuilder = inject(FormBuilder);
    protected mainForm!: FormGroup;

    protected step1Data = signal<any>(null);

    protected readonly processHttpService = inject(ProcessHttpService);
    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly coreSessionStorageService = inject(CoreSessionStorageService);

    constructor() {
        this.mainForm = this.formBuilder.group({});

        this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, {
            type: {
                id: '4fcbe6da-c9b3-4a3b-b2f7-3a5f865d4de9',
                code: 'registration',
                name: 'Registro'
            }
        });
    }

    async ngOnInit() {
        await this.loadData();
    }

    async loadData() {
        this.step1Data.set(await this.coreSessionStorageService.getEncryptedValue(CoreEnum.step1));
    }

    saveForm(childForm: FormGroup) {
        Object.keys(childForm.controls).forEach((controlName) => {
            if (!this.mainForm.contains(controlName)) {
                this.mainForm.addControl(controlName, this.formBuilder.control(childForm.get(controlName)?.value));
            } else {
                this.mainForm.get(controlName)?.patchValue(childForm.get(controlName)?.value);
            }
        });
    }

    async onSubmit() {
        if (this.checkFormErrors()) await this.saveProcess();
    }

    checkFormErrors() {
        const errors: string[] = collectFormErrors([this.juridicalPersonComponent]);

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    async saveProcess() {
        await this.coreSessionStorageService.setEncryptedValue(CoreEnum.step1, { ...this.mainForm.value });
        const { type, processId } = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);

        const payload = { ...this.mainForm.value, processId, type };

        this.processHttpService.createStep1(payload).subscribe({
            next: (response: any) => {
                this.step.emit(2);
                this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, {
                    processId:response.id,
                });
            }
        });
    }

    back() {
        this.router.navigateByUrl(MY_ROUTES.corePages.external.establishment.absolute);
    }
}
