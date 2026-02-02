import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelDirective } from '@utils/directives/label.directive';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { TemporarySuspensionStatusComponent } from './temporary-suspension-status/temporary-suspension-status.component';

import { InspectionStatusService } from '../../services/inspection-status.service';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueCadastresStateEnum, CatalogueTypeEnum } from '@utils/enums';
import { CatalogueInterface } from '@utils/interfaces';
import { PrimeIcons } from 'primeng/api';
import { Fluid } from 'primeng/fluid';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Message } from 'primeng/message';
import { RatifiedStatusComponent } from './ratified-status/ratified-status.component';
import { InactiveStatusComponent } from './inactive-status/inactive-status.component';
import { DefinitiveSuspensionStatus } from './definitive-suspension-status/definitive-suspension-status';
import { RecategorizationComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/event/recategorization/recategorization.component';
import { RecategorizedStatusComponent } from './recategorized-status/recategorized-status.component';
import { ReclassifiedStatusComponent } from './reclassified-status/reclassified-status.component';

@Component({
    selector: 'app-results',
    standalone: true,
    imports: [
        Dialog,
        ButtonModule,
        Select,
        FormsModule,
        ReactiveFormsModule,
        LabelDirective,
        CommonModule,
        Fluid,
        ErrorMessageDirective,
        Message,
        RatifiedStatusComponent,
        InactiveStatusComponent,
        TemporarySuspensionStatusComponent,
        DefinitiveSuspensionStatus,
        RecategorizedStatusComponent,
        ReclassifiedStatusComponent
    ],
    templateUrl: './results.component.html',
    styleUrl: './results.component.scss'
})
export class ResultsComponent implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;
    protected readonly CatalogueCadastresStateEnum = CatalogueCadastresStateEnum;
    private readonly catalogueService = inject(CatalogueService);

    protected states: CatalogueInterface[] = [];
    protected stateControl = new FormControl<CatalogueInterface>({}, [Validators.required]);
    isVisibleModal: boolean = false;

    async ngOnInit(): Promise<void> {
        await this.loadCatalogues();
    }

    async loadCatalogues() {
        this.states = await this.catalogueService.findByType(CatalogueTypeEnum.cadastre_states_state);
    }

    showDialog() {
        this.isVisibleModal = true;
    }

    closeModal() {
        this.isVisibleModal = false;
        this.stateControl.setValue(null);
        this.stateControl.markAsPristine();
        this.stateControl.markAsUntouched();
    }
}
