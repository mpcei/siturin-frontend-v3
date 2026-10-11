import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GadRoutingModule } from './gad-routing.module';
import { SiitComponent } from './siit/siit.component';


@NgModule({
    imports: [
        CommonModule,
        GadRoutingModule,
        SiitComponent
    ]
})
export class GadModule { }
