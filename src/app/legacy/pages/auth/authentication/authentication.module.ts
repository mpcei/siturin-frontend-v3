import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthenticationRoutingModule} from './authentication-routing.module';
import {LoginComponent} from "./login/login.component";
import {PasswordChangeComponent} from "./password-change/password-change.component";
import {PasswordResetComponent} from "./password-reset/password-reset.component";

import {DividerModule} from "primeng/divider";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {CheckboxModule} from "primeng/checkbox";
import {InputTextModule} from "primeng/inputtext";
import {PasswordModule} from "primeng/password";
import {RippleModule} from "primeng/ripple";
import {ReactiveFormsModule} from "@angular/forms";
import {ScrollPanelModule} from 'primeng/scrollpanel';
import { CreateAccountComponent } from './create-account/create-account.component';
import {KeyFilterModule} from 'primeng/keyfilter';
import {ScrollTopModule} from 'primeng/scrolltop';
import {InputMaskModule} from 'primeng/inputmask';
import {DialogModule} from "primeng/dialog";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {DatePickerModule as CalendarModule} from "primeng/datepicker";
import {MessageModule} from "primeng/message";
import {MessageModule as MessagesModule} from "primeng/message";
import {TagModule} from "primeng/tag";
import { ValidationQuestionComponent } from './validation-question/validation-question.component';


@NgModule({
    exports: [PasswordChangeComponent, ValidationQuestionComponent],
    imports: [
    CommonModule,
    AuthenticationRoutingModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    InputTextModule,
    PasswordModule,
    RippleModule,
    ScrollPanelModule,
    KeyFilterModule,
    ScrollTopModule,
    InputMaskModule,
    DialogModule,
    PdfViewerModule,
    CalendarModule,
    MessageModule,
    MessagesModule,
    TagModule,
    LoginComponent, PasswordChangeComponent, PasswordResetComponent, CreateAccountComponent, ValidationQuestionComponent,
]
})
export class AuthenticationModule {
}
