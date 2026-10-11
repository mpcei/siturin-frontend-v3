import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {BitacoraRoutingModule} from './bitacora-routing.module';

import {DatePickerModule as CalendarModule} from 'primeng/datepicker';
import {ToolbarModule} from 'primeng/toolbar';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {SelectModule as DropdownModule} from 'primeng/select';
import {InputTextModule} from 'primeng/inputtext';
import {MessageModule as MessagesModule} from 'primeng/message';
import {DialogModule} from 'primeng/dialog';
import {TagModule} from 'primeng/tag';
import {CheckboxModule} from 'primeng/checkbox';
import {RippleModule} from 'primeng/ripple';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TramitesComponent} from './tramites/tramites.component';
import {HistorialComponent} from './historial/historial.component';
import {CompartidoModule} from "../../compartido/compartido.module";
import {BitacoraComponent} from './bitacora.component';
import {EstablecimientosComponent} from './establecimientos/establecimientos.component';

@NgModule({
    imports: [
    CommonModule,
    BitacoraRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CompartidoModule,
    ButtonModule,
    CalendarModule,
    CardModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    MessagesModule,
    TagModule,
    TooltipModule,
    RippleModule,
    TableModule,
    ToolbarModule,
    BitacoraComponent,
    EstablecimientosComponent,
    HistorialComponent,
    TramitesComponent
]
})

export class BitacoraModule {
}
