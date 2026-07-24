import { Component, effect, inject, input, OnInit, output, OutputEmitterRef, signal } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { invalidEmailDomainValidator, invalidEmailValidator } from '@utils/form-validators/custom-validator';
import { ConfirmationService, PrimeIcons } from 'primeng/api';
import { CatalogueInterface, FileInterface } from '@utils/interfaces';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { AuthService } from '@/pages/auth/auth.service';
import { FormStateService } from '@/pages/core/roles/external/services';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Divider } from 'primeng/divider';
import { Button } from 'primeng/button';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { ProcessGuideValue } from '@/pages/core/shared/pipes/process-guide-value.pipe';
import { Message } from 'primeng/message';
import { FileHttpService } from '@utils/services';
import { Textarea } from 'primeng/textarea';
import { Dialog } from 'primeng/dialog';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { CatalogueProcessesStateEnum } from '@/pages/core/shared/enums';
import {
    InternalInspectionService
} from '@/pages/core/roles/guide-technician/process/services/internal-inspection.service';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { JsonPipe } from '@angular/common';
import { Tag } from 'primeng/tag';

@Component({
    selector: 'app-checklist-form',
    imports: [ReactiveFormsModule, ToggleSwitch, FormsModule, Divider, Button, ProcessGuideValue, Message, Textarea, Dialog, ErrorMessageDirective, LabelDirective, JsonPipe, Tag],
    templateUrl: './checklist-form.component.html'
})
export class ChecklistFormComponent implements OnInit {
    dataIn = input.required<any>();
    dataOut: OutputEmitterRef<any> = output<any>();

    data = signal<any>(null);

    protected readonly PrimeIcons = PrimeIcons;

    protected readonly customMessageService = inject(CustomMessageService);
    protected readonly catalogueService = inject(CatalogueService);
    protected readonly authService = inject(AuthService);
    protected readonly fileHttpService = inject(FileHttpService);
    protected readonly formStateService = inject(FormStateService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly internalInspectionService = inject(InternalInspectionService);
    private readonly router = inject(Router);

    protected observation = new FormControl(null, [Validators.required]);
    protected formInitialized = false;
    protected isVisibleModal: boolean = false;
    protected approved: boolean = false;
    protected allRequirements: boolean = false;
    protected states: CatalogueInterface[] = [];
    protected stateSelected?: CatalogueInterface;

    protected options: any[] = [
        { code: true, name: 'SI' },
        { code: false, name: 'NO' }
    ];

    constructor() {
        effect(() => {
            if (this.dataIn() && !this.formInitialized) {
                this.formInitialized = true;
                this.data.set(structuredClone(this.dataIn()));
            }
        });
    }

    async ngOnInit() {
        await this.loadCatalogues();
        console.log(this.data().processGuides);
    }

    async loadCatalogues() {
        this.states = await this.catalogueService.findByType(CatalogueTypeEnum.processes_state);
    }

    downloadFile(file: FileInterface) {
        this.fileHttpService.downloadFile(file);
    }

    downloadModelFile(modelId: string, fileName: string) {
        this.fileHttpService.downloadModelFile(modelId, fileName);
    }

    accept() {
        this.isVisibleModal = true;
        this.approved = true;
        this.observation.setValidators(null);
        this.observation.updateValueAndValidity();
        this.stateSelected = this.states.find(item => item.code === CatalogueProcessesStateEnum.reviewed);

        if (this.approved) {
            this.allRequirements = this.data().processGuides.every((item: any) => item.state);

            if (!this.allRequirements) {
                this.customMessageService.showWarning({
                    summary: 'No se han aprobado todos los requisitos',
                    detail: ''
                });
            }
        }
    }

    reject() {
        this.isVisibleModal = true;
        this.approved = false;
        this.observation.setValidators(Validators.required);
        this.observation.updateValueAndValidity();
        this.stateSelected = this.states.find(item => item.code === CatalogueProcessesStateEnum.document_rejected);
    }

    confirm() {
        if (this.observation.invalid) {
            this.observation.markAllAsTouched();
            return;
        }

        const message = this.approved ? `
            ¿Está seguro de aprobar los documentos habilitantes cargados por el usuario y enviar la solicitud a la
            siguiente etapa "Aprobación Guianza Turística"?`
            :
            `¿Está seguro de rechazar los documentos habilitantes cargados por el usuario y finalizar el trámite?`;

        const icon = this.approved ? FontAwesome.CHECK_SOLID : FontAwesome.BAN_SOLID;

        this.confirmationService.confirm({
            message,
            header: 'GUARDAR Y FINALIZAR',
            icon,
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'danger',
                text: true
            },
            acceptButtonProps: {
                label: 'Aceptar'
            },
            accept: () => {
                const { ...process } = this.formStateService.process()!;
                const assignment = this.formStateService.assignment()!;
                const payload = {
                    processGuides: this.data().processGuides,
                    processState: this.stateSelected,
                    processId: process.id,
                    assignmentId: assignment.id,
                    observation: this.observation.value
                };

                console.log(payload);

                this.internalInspectionService.review(payload).subscribe({
                    next: () => {
                        this.router.navigate([MY_ROUTES.corePages.guideTechnician.process.absolute]);
                    }
                });
            },
            key: 'confirmdialog'
        });
    }


    protected readonly FontAwesome = FontAwesome;
    protected readonly Validators = Validators;
}
