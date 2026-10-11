import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InternoRoutingModule} from './interno-routing.module';
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
import {InternoComponent} from './interno.component';
import {DashboardComponent} from './dashboard/dashboard.component';

import {TextareaModule as InputTextareaModule} from 'primeng/textarea';
import {RippleModule} from 'primeng/ripple';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputNumberModule} from 'primeng/inputnumber';

@NgModule({
    imports: [
    CommonModule,
    ReactiveFormsModule,
    InternoRoutingModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    TableModule,
    MessagesModule,
    ToolbarModule,
    DialogModule,
    TooltipModule,
    InputTextareaModule,
    RippleModule,
    KeyFilterModule,
    InputNumberModule,
    InternoComponent,
    DashboardComponent,
]
})
export class InternoModule {
}
