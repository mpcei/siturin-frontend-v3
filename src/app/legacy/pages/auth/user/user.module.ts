import {NgModule} from '@angular/core';
import {CommonModule as NgCommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {UserRoutingModule} from './user-routing.module';
import {ButtonModule} from "primeng/button";
import {CheckboxModule} from 'primeng/checkbox';
import {RippleModule} from "primeng/ripple";
import {TableModule} from 'primeng/table';
import {MessageModule} from "primeng/message";
import {UserComponent} from './user.component';
import {UserListComponent} from './user-list/user-list.component';
import {UserFormComponent} from './user-form/user-form.component';
import {ToolbarModule} from 'primeng/toolbar';
import {TooltipModule} from 'primeng/tooltip';
import {InputTextModule} from 'primeng/inputtext';

import {DatePickerModule as CalendarModule} from 'primeng/datepicker';
import {SelectModule as DropdownModule} from 'primeng/select';
import {PasswordModule} from 'primeng/password';
import {CardModule} from "primeng/card";
import {ToastModule} from "primeng/toast";
import {PaginatorModule} from "primeng/paginator";
import {KeyFilterModule} from "primeng/keyfilter";
import {DialogModule} from "primeng/dialog";
import {ProfileComponent} from './profile/profile.component';
import {AuthModule} from "../auth.module";
import {ToggleSwitchModule as InputSwitchModule} from "primeng/toggleswitch";
import {PanelModule} from "primeng/panel";
import {MenuModule} from 'primeng/menu';
import {TagModule} from "primeng/tag";
import {DividerModule} from "primeng/divider";
import {AccordionModule} from "primeng/accordion";
import {UserInformationComponent} from "./user-information/user-information.component";
import {UserProfileComponent} from "./user-profile/user-profile.component";
import {MultiSelectModule} from "primeng/multiselect";
import {SplitButtonModule} from "primeng/splitbutton";
import {BadgeModule} from 'primeng/badge';
import {AuthenticationModule} from "../authentication/authentication.module";
import {ValidatedQuestionCreateComponent} from "./validated-question-create/validated-question-create.component";
import {MessageModule as MessagesModule} from "primeng/message";

@NgModule({
    imports: [
    NgCommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    AuthModule,
    AuthenticationModule,
    //PrimeNg
    BadgeModule,
    ButtonModule,
    CardModule,
    CalendarModule,
    CheckboxModule,
    DialogModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    KeyFilterModule,
    MenuModule,
    MessageModule,
    PaginatorModule,
    PanelModule,
    PasswordModule,
    RippleModule,
    TableModule,
    TagModule,
    ToolbarModule,
    TooltipModule,
    ToastModule,
    DividerModule,
    AccordionModule,
    MultiSelectModule,
    SplitButtonModule,
    MessagesModule,
    UserComponent,
    UserFormComponent,
    UserListComponent,
    ProfileComponent,
    UserInformationComponent,
    UserProfileComponent,
    ValidatedQuestionCreateComponent,
]
})
export class UserModule {
}
