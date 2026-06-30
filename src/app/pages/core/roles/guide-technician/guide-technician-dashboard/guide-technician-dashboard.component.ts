import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-guide-technician-dashboard',
    imports: [Button, RouterModule],
    templateUrl: './guide-technician-dashboard.component.html'
})
export default class GuideTechnicianDashboardComponent {
    myRoutes = MY_ROUTES;
}
