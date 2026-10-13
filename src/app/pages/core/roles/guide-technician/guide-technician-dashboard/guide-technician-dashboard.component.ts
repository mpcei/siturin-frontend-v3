import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { Button } from 'primeng/button';
import ProcessComponent from '@/pages/core/roles/guide-technician/components/process/process.component';

@Component({
    selector: 'app-guide-technician-dashboard',
    imports: [Button, RouterModule, ProcessComponent],
    templateUrl: './guide-technician-dashboard.component.html'
})
export default class GuideTechnicianDashboardComponent {
    myRoutes = MY_ROUTES;
}
