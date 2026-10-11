import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {CoreRoutingModule} from './core-routing.module';
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {MessageModule} from "primeng/message";
import { SyncRucComponent } from './sync-ruc/sync-ruc.component';

@NgModule({
    imports: [
        NgCommonModule,
        CoreRoutingModule,
        ButtonModule,
        RippleModule,
        MessageModule,
        SyncRucComponent
    ]
})
export class CoreModule {
}
