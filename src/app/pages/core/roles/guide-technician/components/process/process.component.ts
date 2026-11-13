import { Component, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { PrimeIcons } from 'primeng/api';
import { BreadcrumbService } from '@layout/service';
import {
    InternalInspectionService
} from '@/pages/core/roles/guide-technician/components/process/services/internal-inspection.service';
import { DatePipe } from '@angular/common';
import { differenceInDays, format, isAfter } from 'date-fns';
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
import { Dialog } from 'primeng/dialog';
import { LabelDirective } from '@utils/directives/label.directive';
import { DatePicker } from 'primeng/datepicker';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { PaginationInterface } from '@utils/interfaces';

@Component({
    selector: 'app-process',
    imports: [TableModule, ButtonModule, DividerModule, PanelModule, DatePipe, EstablishmentNumberPipe, Tag, ProcessStateSeverityPipe, Tooltip, Tabs, TabList, Tab, TabPanels, TabPanel, InputText, ReactiveFormsModule, Dialog, LabelDirective, DatePicker, Paginator],
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
    protected isFiltering = signal<boolean>(false);
    protected activeFilters: any[] = [];
    protected pagination!: PaginationInterface;
    protected paginationCompleted!: PaginationInterface;

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
            startedAt: [''],
            endedAt: ['']
        });
    }

    applyActiveFilters() {
        this.activeFilters = Object.entries(this.filterForm.getRawValue())
            .filter(([_, value]) =>
                value !== null &&
                value !== undefined &&
                value !== ''
            )
            .map(([key, value]) => ({
                key,
                value
            }));
    }

    validateStartedAt() {
        const valid = isAfter(new Date(this.filterForm.controls['startedAt'].value!), new Date(this.filterForm.controls['endedAt'].value!));
    }

    findProcesses(isFilter = false, page = 1) {
        if (!isFilter) {
            this.filterForm.reset();
            this.activeFilters = [];
        }

        this.isFiltering.set(isFilter);

        if (isFilter) {
            this.applyActiveFilters();

            if (this.filterForm.controls['startedAt'].value && this.filterForm.controls['endedAt'].value) {
                const startedAtFormat = format(new Date(this.filterForm.controls['startedAt'].value!), 'yyyy-MM-dd');
                const endedAtFormat = format(new Date(this.filterForm.controls['endedAt'].value!), 'yyyy-MM-dd');
                this.filterForm.controls['startedAt'].patchValue(startedAtFormat);
                this.filterForm.controls['endedAt'].patchValue(endedAtFormat);
            }
        }

        const filters = this.filterForm.getRawValue();

        this.internalInspectionService.findProcesses(page, true, filters).subscribe({
            next: (response) => {
                this.pagination = response.pagination!;
                this.items.set(response.data);
                this.filterModal.set(false);
            }
        });
    }

    findCompletedProcesses(isFilter = false, page = 1) {
        if (!isFilter) {
            this.filterForm.reset();
            this.activeFilters = [];
        }

        this.isFiltering.set(isFilter);

        if (isFilter) this.applyActiveFilters();

        if (isFilter) {
            if (this.filterForm.controls['startedAt'].value && this.filterForm.controls['endedAt'].value) {
                const startedAtFormat = format(new Date(this.filterForm.controls['startedAt'].value!), 'yyyy-MM-dd');
                const endedAtFormat = format(new Date(this.filterForm.controls['endedAt'].value!), 'yyyy-MM-dd');
                this.filterForm.controls['startedAt'].patchValue(startedAtFormat);
                this.filterForm.controls['endedAt'].patchValue(endedAtFormat);
            }
        }

        const filters = this.filterForm.getRawValue();

        this.internalInspectionService.findProcesses(page, false, filters).subscribe({
            next: (response) => {
                this.paginationCompleted = response.pagination!;
                this.completedProcesses.set(response.data);
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

    onPagination(paginatorState: PaginatorState, isCurrent:boolean) {
        if (paginatorState?.page || paginatorState.page === 0) this.findProcesses(isCurrent, paginatorState.page + 1);
    }

    onPaginationCompleted(paginatorState: PaginatorState, isCurrent:boolean) {
        if (paginatorState?.page || paginatorState.page === 0) this.findCompletedProcesses(isCurrent, paginatorState.page + 1);
    }

    protected readonly es = es;
    protected readonly differenceInDays = differenceInDays;
    protected readonly FontAwesome = FontAwesome;
}
