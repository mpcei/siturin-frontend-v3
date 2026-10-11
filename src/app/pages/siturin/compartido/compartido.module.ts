import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompartidoRoutingModule } from './compartido-routing.module';
import { DatosSriComponent } from './datos-sri/datos-sri.component';
import { DatosSuperciasComponent } from './datos-supercias/datos-supercias.component';
import { NormativaComponent } from './normativa/normativa.component';
import { NormativaModalidadTurismoAventuraComponent } from './normativa-modalidad-turismo-aventura/normativa-modalidad-turismo-aventura.component';
import { NormativaServiciosComplementariosGalapagosComponent } from './normativa-servicios-complementarios-galapagos/normativa-servicios-complementarios-galapagos.component';

import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule as InputSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerModule as CalendarModule } from 'primeng/datepicker';
import { SelectModule as DropdownModule } from 'primeng/select';
import { RippleModule } from 'primeng/ripple';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { AutoCompleteModule as ChipsModule } from 'primeng/autocomplete';
import { AlimentosBebidasInternoComponent } from './actividades/alimentos-bebidas-interno/alimentos-bebidas-interno.component';
import { AlojamientoInternoComponent } from './actividades/alojamiento-interno/alojamiento-interno.component';
import { OperacionIntermediacionInternoComponent } from './actividades/operacion-intermediacion-interno/operacion-intermediacion-interno.component';
import { NormativaInternoComponent } from './actividades/normativa-interno/normativa-interno.component';
import { NormativaModalidadTurismoAventuraCtcComponent } from './normativa-modalidad-turismo-aventura-ctc/normativa-modalidad-turismo-aventura-ctc.component';
import { NormativaGenericaComponent } from './normativa-generica/normativa-generica.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    exports: [
        DatosSriComponent,
        DatosSuperciasComponent,
        NormativaComponent,
        NormativaModalidadTurismoAventuraComponent,
        NormativaModalidadTurismoAventuraCtcComponent,
        NormativaServiciosComplementariosGalapagosComponent,
        AlimentosBebidasInternoComponent,
        AlojamientoInternoComponent,
        OperacionIntermediacionInternoComponent,
        NormativaInternoComponent,
        NormativaGenericaComponent
    ],
    imports: [
        CommonModule,
        CompartidoRoutingModule,
        ReactiveFormsModule,
        CardModule,
        TableModule,
        InputSwitchModule,
        TagModule,
        CalendarModule,
        DropdownModule,
        RippleModule,
        PaginatorModule,
        PanelModule,
        ChipsModule,
        TooltipModule,
        DatosSriComponent,
        DatosSuperciasComponent,
        NormativaComponent,
        NormativaModalidadTurismoAventuraComponent,
        NormativaModalidadTurismoAventuraCtcComponent,
        NormativaServiciosComplementariosGalapagosComponent,
        AlimentosBebidasInternoComponent,
        AlojamientoInternoComponent,
        OperacionIntermediacionInternoComponent,
        NormativaInternoComponent,
        NormativaGenericaComponent
    ]
})
export class CompartidoModule {}
