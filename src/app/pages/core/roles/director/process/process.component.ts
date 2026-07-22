import { Component, inject, OnInit, QueryList, signal, ViewChildren } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { DownloadDocumentsComponent } from './activities/download-documents/download-documents.component';
import { PrimeIcons } from 'primeng/api';
import { Message } from 'primeng/message';
import { BreadcrumbService } from '@layout/service';
import {
    InternalInspectionService
} from '@/pages/core/roles/guide-technician/process/services/internal-inspection.service';
import { DatePipe } from '@angular/common';
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

@Component({
    selector: 'app-process',
    imports: [TableModule, ButtonModule, DividerModule, PanelModule, Message, DatePipe, EstablishmentNumberPipe, Tag, ProcessStateSeverityPipe, Tooltip],
    templateUrl: './process.component.html'
})
export default class ProcessComponent implements OnInit {
    @ViewChildren(DownloadDocumentsComponent) private downloadDocumentsComponent!: QueryList<DownloadDocumentsComponent>;
    protected readonly formStateService = inject(FormStateService);
    protected readonly PrimeIcons = PrimeIcons;
    protected CatalogueProcessesTypeEnum = CatalogueProcessesTypeEnum;
    private readonly router = inject(Router);
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly internalInspectionService = inject(InternalInspectionService);
    protected items = signal([]);
    protected currentDate = new Date();

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Listado de Trámites' }]);
    }

    ngOnInit() {
        this.findProcesses();
    }

    findProcesses() {
        this.internalInspectionService.findProcesses('1', true).subscribe({
            next: (response) => {
                this.items.set(response);
            }
        });
    }

    goToProcess(processId: string, assignmentId: string) {
        console.log(assignmentId);
        this.formStateService.updateSection('process', { id: processId });
        this.formStateService.updateSection('assignment', { id: assignmentId });
        this.router.navigate([MY_ROUTES.corePages.guideTechnician.checklist.absolute, processId]);
    }

    protected readonly es = es;
    protected readonly differenceInDays = differenceInDays;
    protected readonly FontAwesome = FontAwesome;
}
