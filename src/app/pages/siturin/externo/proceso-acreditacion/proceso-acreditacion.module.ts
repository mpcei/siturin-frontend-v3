import {NgModule} from '@angular/core';

import {DatosEstablecimientoComponent} from './datos-establecimiento/datos-establecimiento.component';
import {
  DatosAcreditacionTuristicaComponent
} from './datos-acreditacion-turistica/datos-acreditacion-turistica.component';
import {DatosPersonaComponent} from './datos-persona/datos-persona.component';

import {ProcesoAcreditacionComponent} from './proceso-acreditacion.component';
import {NormativaAlimentosBebidasComponent} from './normativa-alimentos-bebidas/normativa-alimentos-bebidas.component';
import {NormativaAlojamientoComponent} from './normativa-alojamiento/normativa-alojamiento.component';
import {
  NormativaOperacionIntermediacionComponent
} from './normativa-operacion-intermediacion/normativa-operacion-intermediacion.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {PanelModule} from 'primeng/panel';
import {SiturinModule} from '../../siturin.module';
import {TagModule} from 'primeng/tag';
import {InactivacionComponent} from './inactivacion/inactivacion.component';
import {
  NormativaAlimentosBebidasGalapagosComponent
} from './normativa-alimentos-bebidas-galapagos/normativa-alimentos-bebidas-galapagos.component';
import {
  NormativaAlojamientoGalapagosComponent
} from './normativa-alojamiento-galapagos/normativa-alojamiento-galapagos.component';
import {FileUploadModule} from 'primeng/fileupload';
import {CompartidoModule} from "../../compartido/compartido.module";
import {DatePickerModule as CalendarModule} from "primeng/datepicker";
import {TarifarioRackComponent} from './tarifario-rack/tarifario-rack.component';
import {AccordionModule} from 'primeng/accordion';
import {
  InmueblesHabitacionalesComponent
} from "./alojamiento/inmuebles-habitacionales/inmuebles-habitacionales.component";
import { CtcComponent } from './ctc/ctc.component';
import {TabsModule as TabViewModule} from "primeng/tabs";
import { CtcActualizacionComponent } from './ctc/ctc-actualizacion/ctc-actualizacion.component';
import { CtcNuevaActividadComponent } from './ctc/ctc-nueva-actividad/ctc-nueva-actividad.component';
import { TransporteComponent } from './transporte/transporte.component';
import { TransporteRegistroComponent } from './transporte/transporte-registro/transporte-registro.component';
import {PopoverModule as OverlayPanelModule} from "primeng/popover";
import { NormativaParqueComponent } from './normativa-parque/normativa-parque.component';
import { NormativaEventoComponent } from './normativa-evento/normativa-evento.component';
import { CommonModule } from '@angular/common';
import { ProcesoAcreditacionRoutingModule } from './proceso-acreditacion-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ToolbarModule } from 'primeng/toolbar';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DividerModule } from 'primeng/divider';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { SkeletonModule } from 'primeng/skeleton';
import { SimuladorModule } from '../../simulador/simulador.module';

@NgModule({
    exports: [
        DatosPersonaComponent,
        DatosAcreditacionTuristicaComponent,
        InactivacionComponent,
        NormativaAlimentosBebidasComponent,
        TarifarioRackComponent,
        CtcComponent,
        TransporteComponent
    ],
    imports: [
    CommonModule,
    ProcesoAcreditacionRoutingModule,
    ReactiveFormsModule,
    CardModule,
    MessageModule,
    // MessagesModule,
    ToolbarModule,
    PaginatorModule,
    TableModule,
    ButtonModule,
    RippleModule,
    SplitButtonModule,
    InputTextModule,
    StepsModule,
    KeyFilterModule,
    // InputSwitchModule,
    DividerModule,
    // InputTextareaModule,
    // GMapModule,
    // DialogModule,
    CheckboxModule,
    InputMaskModule,
    SkeletonModule,
    // SimuladorModule,
    MultiSelectModule,
    PanelModule,
    SiturinModule,
    TagModule,
    FileUploadModule,
    CompartidoModule,
    CalendarModule,
    AccordionModule,
    TabViewModule,
    OverlayPanelModule,
    ProcesoAcreditacionComponent,
    DatosEstablecimientoComponent,
    DatosAcreditacionTuristicaComponent,
    DatosPersonaComponent,
    NormativaAlimentosBebidasComponent,
    NormativaAlojamientoComponent,
    InmueblesHabitacionalesComponent,
    NormativaOperacionIntermediacionComponent,
    InactivacionComponent,
    NormativaAlimentosBebidasGalapagosComponent,
    NormativaAlojamientoGalapagosComponent,
    TarifarioRackComponent,
    CtcComponent,
    CtcActualizacionComponent,
    CtcNuevaActividadComponent,
    TransporteComponent,
    TransporteRegistroComponent,
    NormativaParqueComponent,
    NormativaEventoComponent
]
})
export class ProcesoAcreditacionModule {
}
