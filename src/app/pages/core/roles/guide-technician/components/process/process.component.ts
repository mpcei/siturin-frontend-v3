import { Component, inject, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { PrimeIcons } from 'primeng/api';
import { Message } from 'primeng/message';
import { BreadcrumbService } from '@layout/service';
import {
    InternalInspectionService
} from '@/pages/core/roles/guide-technician/components/process/services/internal-inspection.service';
import { DatePipe, JsonPipe } from '@angular/common';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { EstablishmentNumberPipe, ProcessStateSeverityPipe } from '@/pages/core/shared/pipes';
import { Tag } from 'primeng/tag';
import { CatalogueProcessesTypeEnum } from '@utils/enums';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { Tooltip } from 'primeng/tooltip';
import { Router } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { FormStateService } from '@/pages/core/roles/external/services';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { CustomMessageService } from '@utils/services';
import { ReportsHttpService } from '@/pages/core/shared/services';
import { AuthService } from '@/pages/auth/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Dialog } from 'primeng/dialog';
import { LabelDirective } from '@utils/directives/label.directive';

@Component({
    selector: 'app-process',
    imports: [TableModule, ButtonModule, DividerModule, PanelModule, Message, DatePipe, EstablishmentNumberPipe, Tag, ProcessStateSeverityPipe, Tooltip, Tabs, TabList, Tab, TabPanels, TabPanel, InputText, ReactiveFormsModule, Select, Dialog, LabelDirective, JsonPipe],
    templateUrl: './process.component.html'
})
export default class ProcessComponent implements OnInit {
    protected readonly formStateService = inject(FormStateService);
    protected readonly PrimeIcons = PrimeIcons;
    protected CatalogueProcessesTypeEnum = CatalogueProcessesTypeEnum;
    private readonly router = inject(Router);
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly internalInspectionService = inject(InternalInspectionService);
    private readonly customMessageService = inject(CustomMessageService);
    private readonly reportsHttpService = inject(ReportsHttpService);
    private readonly authService = inject(AuthService);
    protected items = signal([]);
    protected completedProcesses = signal([]);
    protected currentDate = new Date();
    protected readonly formBuilder = inject(FormBuilder);
    protected readonly filterForm = this.buildFilter();
    protected filterModal = signal<boolean>(false);

    protected establishmentNumbers = Array.from({ length: 999 }, (_, i) => i + 1);

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Listado de Trámites' }]);
    }

    ngOnInit() {
        this.findProcesses();
        this.findCompletedProcesses();


    }

    buildFilter() {
        return this.formBuilder.group({
            registerNumber: [null],
            establishmentNumber: [null],
            legalName: [null],
            classification: [null],
            processType: [null],
            province: [null],
            canton: [null],
            parish: [null],
            cadastreState: [null],
            registerProcess: [null]
        });
    }

    findProcesses(isFilter = false) {
        if (!isFilter) this.filterForm.reset();

        const filters = this.filterForm.getRawValue();

        this.internalInspectionService.findProcesses('1', true, filters).subscribe({
            next: (response) => {
                this.items.set(response);
                this.filterModal.set(false);
            }
        });
    }

    findCompletedProcesses() {
        const filters = this.filterForm.getRawValue();

        this.internalInspectionService.findProcesses('1', false, filters).subscribe({
            next: (response) => {
                this.completedProcesses.set(response);
            }
        });
    }

    goToProcess(processId: string, assignmentId: string, isCurrent: boolean) {
        this.formStateService.updateSection('process', { id: processId });
        this.formStateService.updateSection('assignment', { id: assignmentId });
        this.customMessageService.showModalInfo({
            summary: 'Nota informativa al Técnico Zonal',
            detail:
                `Recuerde que usted deberá revisar los requisitos documentales en apego al marco
            normativo (recuerde revisar siempre la normativa antes emitir un resultado), mismos que
            deben ser sustentados en el expediente digital por solicitud: requisitos, fotografía,
            declaratorias, otros`

        });
        this.router.navigate([MY_ROUTES.corePages.guideTechnician.checklist.absolute, processId, isCurrent]);
    }

    goToProcessComplete(processId: string, assignmentId: string, isCurrent: boolean) {
        this.formStateService.updateSection('process', { id: processId });
        this.formStateService.updateSection('assignment', { id: assignmentId });
        this.router.navigate([MY_ROUTES.corePages.guideTechnician.checklist.absolute, processId, isCurrent]);
    }

    protected downloadProcessesByTechnician() {
        this.reportsHttpService.downloadProcessesByTechnician(this.authService.role.code, true);
    }

    protected readonly es = es;
    protected readonly differenceInDays = differenceInDays;
    protected readonly FontAwesome = FontAwesome;
}
