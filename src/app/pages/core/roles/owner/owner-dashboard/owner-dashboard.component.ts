import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { Appointments } from '@/pages/core/roles/owner/components/appointments/appointments';

@Component({
    selector: 'app-owner-dashboard',
    imports: [RouterModule, Appointments],
    templateUrl: './owner-dashboard.component.html',
    styleUrl: './owner-dashboard.component.scss'
})
export class OwnerDashboardComponent {
    myRoutes = MY_ROUTES;
}
