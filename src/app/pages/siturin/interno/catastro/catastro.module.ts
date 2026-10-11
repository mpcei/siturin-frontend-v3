import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CatastroRoutingModule} from './catastro-routing.module';
import {CardModule} from 'primeng/card';
import {SelectModule as DropdownModule} from 'primeng/select';
import {ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {MessageModule as MessagesModule} from 'primeng/message';
import {ToolbarModule} from 'primeng/toolbar';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {TooltipModule} from 'primeng/tooltip';
import {CatastroComponent} from './catastro.component';
import {CatastroListComponent} from './catastro-list/catastro-list.component';
import {RippleModule} from 'primeng/ripple';
import {PaginatorModule} from 'primeng/paginator';
import {InternoModule} from '../interno.module';
import {CatastroFormComponent} from './catastro-form/catastro-form.component';

import {TextareaModule as InputTextareaModule} from 'primeng/textarea';
import {AlojamientoComponent} from './actividades/alojamiento/alojamiento.component';
import {PanelModule} from 'primeng/panel';
import {AlimentosBebidasComponent} from './actividades/alimentos-bebidas/alimentos-bebidas.component';
import {
  OperacionIntermediacionComponent
} from './actividades/operacion-intermediacion/operacion-intermediacion.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {ToggleSwitchModule as InputSwitchModule} from 'primeng/toggleswitch';
import {TagModule} from 'primeng/tag';
import {DatePickerModule as CalendarModule} from 'primeng/datepicker';
import {CompartidoModule} from "../../compartido/compartido.module";
import { InactivacionInternoComponent } from './inactivacion-interno/inactivacion-interno.component';
import {CheckboxModule} from 'primeng/checkbox';
import {DividerModule} from 'primeng/divider';
import {FileUploadModule} from 'primeng/fileupload';

@NgModule({
    exports: [
        AlojamientoComponent,
        AlimentosBebidasComponent,
        OperacionIntermediacionComponent,
        InactivacionInternoComponent
    ],
    imports: [
    CommonModule,
    ReactiveFormsModule,
    CatastroRoutingModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    MessagesModule,
    ToolbarModule,
    DialogModule,
    TooltipModule,
    RippleModule,
    PaginatorModule,
    InternoModule,
    InputTextareaModule,
    PanelModule,
    MultiSelectModule,
    InputSwitchModule,
    TagModule,
    CalendarModule,
    CompartidoModule,
    CheckboxModule,
    DividerModule,
    FileUploadModule,
    CatastroComponent,
    CatastroListComponent,
    CatastroFormComponent,
    AlojamientoComponent,
    AlimentosBebidasComponent,
    OperacionIntermediacionComponent,
    InactivacionInternoComponent
]
})
export class CatastroModule {
}
