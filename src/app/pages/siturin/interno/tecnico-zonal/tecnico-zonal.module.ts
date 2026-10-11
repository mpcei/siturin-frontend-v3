import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TecnicoZonalRoutingModule} from './tecnico-zonal-routing.module';
import {TecnicoZonalComponent} from './tecnico-zonal.component';
import {CardModule} from 'primeng/card';
import {SelectModule as DropdownModule} from 'primeng/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {MessageModule as MessagesModule} from 'primeng/message';
import {ToolbarModule} from 'primeng/toolbar';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {TramiteListComponent} from './tramite-list/tramite-list.component';
import {TramiteAsignacionesComponent} from './tramite-asignaciones/tramite-asignaciones.component';

import {DatePickerModule as CalendarModule} from 'primeng/datepicker';
import {MultiSelectModule} from 'primeng/multiselect';
import {FileUploadModule} from 'primeng/fileupload';
import {TagModule} from "primeng/tag";
import {ToggleSwitchModule as InputSwitchModule} from 'primeng/toggleswitch';
import {DividerModule} from 'primeng/divider';
import {TabsModule as TabViewModule} from 'primeng/tabs';
import {CompartidoModule} from "../../compartido/compartido.module";
import {RippleModule} from "primeng/ripple";
import {TextareaModule as InputTextareaModule} from "primeng/textarea";
import {CheckboxModule} from 'primeng/checkbox';
import {PaginatorModule} from "primeng/paginator";
import {CatastroModule} from "../catastro/catastro.module";
import {ProcesoAcreditacionModule} from "../../externo/proceso-acreditacion/proceso-acreditacion.module";

@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TecnicoZonalRoutingModule,
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
    RippleModule,
    InputTextareaModule,
    CheckboxModule,
    PaginatorModule,
    CatastroModule,
    ProcesoAcreditacionModule,
    TecnicoZonalComponent,
    TramiteListComponent,
    TramiteAsignacionesComponent,
]
})
export class TecnicoZonalModule {
}
