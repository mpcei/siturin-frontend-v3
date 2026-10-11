import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {SiturinRoutingModule} from './siturin-routing.module';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MessageModule} from "primeng/message";
import {CardModule} from 'primeng/card';
import {MessageModule as MessagesModule} from 'primeng/message';
import {StepsModule} from 'primeng/steps';

import {ToggleSwitchModule as InputSwitchModule} from "primeng/toggleswitch";
import {TableModule} from "primeng/table";
import {TagModule} from 'primeng/tag';

@NgModule({
  declarations: [
  ],
  imports: [
    NgCommonModule,
    SiturinRoutingModule,
    ButtonModule,
    CardModule,
    InputSwitchModule,
    MessageModule,
    MessagesModule,
    StepsModule,
    RippleModule,
    TableModule,
    TagModule,
]
})
export class SiturinModule {
}
