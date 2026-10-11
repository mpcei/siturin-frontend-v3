import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ExternoComponent} from './externo.component';
import {CardModule} from 'primeng/card';
import {EstablecimientoListComponent} from './establecimiento-list/establecimiento-list.component';
import {SelectModule as DropdownModule} from 'primeng/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {MessageModule as MessagesModule} from 'primeng/message';
import {ToolbarModule} from 'primeng/toolbar';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {DashboardComponent} from './dashboard/dashboard.component';
import {DatePickerModule as CalendarModule} from 'primeng/datepicker';

import {TagModule} from 'primeng/tag';
import {ProcesoAcreditacionModule} from './proceso-acreditacion/proceso-acreditacion.module';
import {CheckboxModule} from 'primeng/checkbox';
import {RippleModule} from 'primeng/ripple';
import {PdfViewerModule} from "ng2-pdf-viewer";
import { ExternoRoutingModule } from './externo-routing.module';

@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ExternoRoutingModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    MessagesModule,
    ToolbarModule,
    DialogModule,
    TooltipModule,
    CalendarModule,
    TagModule,
    ProcesoAcreditacionModule,
    CheckboxModule,
    RippleModule,
    PdfViewerModule,
    ExternoComponent,
    EstablecimientoListComponent,
    DashboardComponent,
]
})
export class ExternoModule {
}
