import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConsultaCatastroRoutingModule } from './consulta-catastro-routing.module';
import {ConsultaCatastroComponent} from './consulta-catastro.component';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import {ReactiveFormsModule} from '@angular/forms';

import {DividerModule} from "primeng/divider";
import {SelectModule as DropdownModule} from "primeng/select";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {PaginatorModule} from "primeng/paginator";
import {QRCodeModule} from "angularx-qrcode";
import {PopoverModule as OverlayPanelModule} from "primeng/popover";


@NgModule({
  declarations: [ConsultaCatastroComponent],
    imports: [
    CommonModule,
    ConsultaCatastroRoutingModule,
    CardModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    InputMaskModule,
    ReactiveFormsModule,
    DividerModule,
    DropdownModule,
    TableModule,
    DialogModule,
    PaginatorModule,
    QRCodeModule,
    OverlayPanelModule,
]
})
export class ConsultaCatastroModule { }
