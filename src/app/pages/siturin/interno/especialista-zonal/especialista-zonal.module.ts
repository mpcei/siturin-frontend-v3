import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EspecialistaZonalRoutingModule} from './especialista-zonal-routing.module';
import {TramiteAsignacionesComponent} from './tramite-asignaciones/tramite-asignaciones.component';
import {ButtonModule} from 'primeng/button';
import {DatePickerModule as CalendarModule} from 'primeng/datepicker';
import {CardModule} from 'primeng/card';
import {SelectModule as DropdownModule} from 'primeng/select';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {MessageModule as MessagesModule} from 'primeng/message';
import {ToolbarModule} from 'primeng/toolbar';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';

import {MultiSelectModule} from 'primeng/multiselect';
import {FileUploadModule} from 'primeng/fileupload';
import {TagModule} from 'primeng/tag';
import {ToggleSwitchModule as InputSwitchModule} from 'primeng/toggleswitch';
import {DividerModule} from 'primeng/divider';
import {TabsModule as TabViewModule} from 'primeng/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TramiteListComponent} from './tramite-list/tramite-list.component';
import {EspecialistaZonalComponent} from './especialista-zonal.component';
import {CompartidoModule} from '../../compartido/compartido.module';
import {TextareaModule as InputTextareaModule} from "primeng/textarea";
import {PaginatorModule} from 'primeng/paginator';

@NgModule({
    imports: [
    CommonModule,
    EspecialistaZonalRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CompartidoModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    MessagesModule,
    ToolbarModule,
    DialogModule,
    TooltipModule,
    MultiSelectModule,
    FileUploadModule,
    TagModule,
    InputSwitchModule,
    DividerModule,
    TabViewModule,
    InputTextareaModule,
    PaginatorModule,
    EspecialistaZonalComponent,
    TramiteAsignacionesComponent,
    TramiteListComponent
]
})
export class EspecialistaZonalModule {
}
