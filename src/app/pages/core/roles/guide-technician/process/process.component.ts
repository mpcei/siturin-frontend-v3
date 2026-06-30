import { Component, inject, QueryList, ViewChildren } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { DownloadDocumentsComponent } from "./activities/download-documents/download-documents.component";
import { ScheduleComponent } from "./activities/schedule/schedule.component";
import { ResultsComponent } from "./activities/results/results.component";
import { PrimeIcons } from 'primeng/api';
import { Message } from 'primeng/message';
import { Fluid } from 'primeng/fluid';
import { MY_ROUTES } from '@routes';
import { BreadcrumbService } from '@layout/service';

@Component({
    selector: 'app-process',
    imports: [TableModule, ButtonModule, DividerModule, PanelModule, DownloadDocumentsComponent, ScheduleComponent, ResultsComponent, Message, Fluid],
    templateUrl: './process.component.html'
})
export default class ProcessComponent {
    @ViewChildren(DownloadDocumentsComponent) private downloadDocumentsComponent!: QueryList<DownloadDocumentsComponent>;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly breadcrumbService = inject(BreadcrumbService);

    products = [

    ];

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Listado de Trámites'}]);
    }
}
