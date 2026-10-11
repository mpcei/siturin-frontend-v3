import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { MenuFormComponent } from './menu-form/menu-form.component';


@NgModule({
    imports: [
        CommonModule,
        MenuRoutingModule,
        MenuComponent,
        MenuListComponent,
        MenuFormComponent
    ]
})
export class MenuModule { }
