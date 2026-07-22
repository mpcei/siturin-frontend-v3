import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { Button } from 'primeng/button';

@Component({
    selector: 'app-director-dashboard',
    imports: [Button, RouterModule],
    templateUrl: './director-dashboard.component.html'
})
export default class DirectorDashboardComponent {
    myRoutes = MY_ROUTES;
}
