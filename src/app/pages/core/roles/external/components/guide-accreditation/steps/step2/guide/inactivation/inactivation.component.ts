import { Component, inject, OnInit } from '@angular/core';
import { GuideHttpService } from '@/pages/core/roles/external/services';
import { InactivationCauseInterface } from '@/pages/core/shared/interfaces';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { LabelDirective } from '@utils/directives/label.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Button } from 'primeng/button';
import { MultiSelect } from 'primeng/multiselect';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-inactivation',
    imports: [ErrorMessageDirective, LabelDirective, ReactiveFormsModule, Button, MultiSelect],
    templateUrl: './inactivation.component.html'
})
export class InactivationComponent implements OnInit {
    public ref = inject(DynamicDialogRef);
    public config = inject(DynamicDialogConfig);
    establishmentId?: string;
    cadastreId?: string;
    processId?: string;
    processType?: string;

    inactivationCauses = new FormControl<InactivationCauseInterface[]>([], Validators.required);
    readonly guideHttpService = inject(GuideHttpService);
    readonly catalogueService = inject(CatalogueService);
    private readonly confirmationService = inject(ConfirmationService);
    causes: CatalogueInterface[] = [];

    constructor() {
        this.establishmentId = this.config.data.establishmentId;
        this.cadastreId = this.config.data.cadastreId;
        this.processId = this.config.data.processId;
        this.processType = this.config.data.processType;
    }

    async ngOnInit() {
        console.log(this.establishmentId);
        await this.loadCatalogues();
    }

    createInactivation() {
        if (this.inactivationCauses.invalid) {
            this.inactivationCauses.markAllAsTouched();
            return;
        }

        this.confirmationService.confirm({
            message: '¿Está seguro de inactivar?',
            header: 'Inactivar',
            icon: FontAwesome.BAN_SOLID,
            rejectButtonStyleClass: 'p-button-text',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'danger',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Inactivar'
            },
            accept: () => {
                let inactivationCauses = this.inactivationCauses.value as CatalogueInterface[];

                inactivationCauses = inactivationCauses.map((item) => {
                    return {
                        code: item.code,
                        name: item.name
                    };
                });

                const payload = {
                    establishmentId: this.establishmentId,
                    cadastreId: this.cadastreId,
                    processType: this.processType,
                    inactivationCauses
                };

                console.log(payload);

                this.guideHttpService.createInactivation(payload).subscribe({
                    next: (response) => {
                        console.log(response);
                        this.closeModal();
                    }
                });
            },
            key: 'confirmdialog'
        });
    }

    async loadCatalogues() {
        this.causes = await this.catalogueService.findByType(CatalogueTypeEnum.external_inactivation_causes);
    }

    closeModal() {
        this.ref.close({
            resultado: 'ok'
        });
    }
}
