import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { TramiteListComponent } from '@/pages/siturin/interno/tecnico-zonal/tramite-list/tramite-list.component';

@Component({
    selector: 'app-technician-dashboard',
    imports: [RouterModule, TramiteListComponent],
    templateUrl: './technician-dashboard.component.html',
    styleUrl: './technician-dashboard.component.scss'
})
export default class TechnicianDashboardComponent {
    myRoutes = MY_ROUTES;
}
