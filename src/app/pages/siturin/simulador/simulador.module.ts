import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {SimuladorRoutingModule} from './simulador-routing.module';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MessageModule} from "primeng/message";
import {ActividadTuristicaComponent} from './actividad-turistica/actividad-turistica.component';
import {SimuladorComponent} from './simulador.component';

import {PanelModule} from 'primeng/panel';
import {DividerModule} from 'primeng/divider';
import {ReactiveFormsModule} from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import {InputTextModule} from 'primeng/inputtext';
import {SelectModule as DropdownModule} from 'primeng/select';
import {CardModule} from 'primeng/card';
import {FieldsetModule} from 'primeng/fieldset';
import {ToggleSwitchModule as InputSwitchModule} from 'primeng/toggleswitch';
import {TableModule} from 'primeng/table';
import {MessageModule as MessagesModule} from 'primeng/message';
import {TagModule} from 'primeng/tag';
import {CompartidoModule} from "../compartido/compartido.module";
import {InputNumberModule} from "primeng/inputnumber";
import {TabsModule as TabViewModule} from "primeng/tabs";
import {TooltipModule} from "primeng/tooltip";
import { AlojamientoComponent } from './actividades/alojamiento/alojamiento.component';
import { AlimentosComponent } from './actividades/alimentos/alimentos.component';
import { ParquesComponent } from './actividades/parques/parques.component';
import { EventosComponent } from './actividades/eventos/eventos.component';
import { OperacionIntermediacionComponent } from './actividades/operacion-intermediacion/operacion-intermediacion.component';
import { CtcComponent } from './actividades/ctc/ctc.component';
import { TransporteComponent } from './actividades/transporte/transporte.component';

@NgModule({
    imports: [
    NgCommonModule,
    SimuladorRoutingModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    MessageModule,
    PanelModule,
    DividerModule,
    MultiSelectModule,
    DropdownModule,
    CardModule,
    FieldsetModule,
    InputSwitchModule,
    TableModule,
    MessagesModule,
    TagModule,
    CompartidoModule,
    InputNumberModule,
    TabViewModule,
    TooltipModule,
    ActividadTuristicaComponent,
    SimuladorComponent,
    AlojamientoComponent,
    AlimentosComponent,
    ParquesComponent,
    EventosComponent,
    OperacionIntermediacionComponent,
    CtcComponent,
    TransporteComponent
]
})
export class SimuladorModule {
}
