import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ValidadorDocumentoRoutingModule } from './validador-documento-routing.module';
import {ValidadorDocumentoComponent} from './validador-documento.component';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {InputTextModule} from 'primeng/inputtext';
import {InputMaskModule} from 'primeng/inputmask';
import {ReactiveFormsModule} from '@angular/forms';

import {DividerModule} from "primeng/divider";


@NgModule({
    imports: [
    CommonModule,
    ValidadorDocumentoRoutingModule,
    CardModule,
    ButtonModule,
    RippleModule,
    InputTextModule,
    InputMaskModule,
    ReactiveFormsModule,
    DividerModule,
    ValidadorDocumentoComponent,
]
})
export class ValidadorDocumentoModule { }
