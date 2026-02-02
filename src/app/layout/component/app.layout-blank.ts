import { Component, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-blank',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `<router-outlet />`
})
export class AppLayoutBlank {

}
