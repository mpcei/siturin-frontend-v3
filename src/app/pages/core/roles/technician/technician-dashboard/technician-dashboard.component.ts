import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-technician-dashboard',
  imports: [Button,
    RouterModule],
  templateUrl: './technician-dashboard.component.html',
  styleUrl: './technician-dashboard.component.scss'
})
export class TechnicianDashboardComponent {
    myRoutes = MY_ROUTES;
}
