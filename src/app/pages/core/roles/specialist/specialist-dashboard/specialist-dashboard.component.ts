import { Component } from '@angular/core';
import { TramiteListComponent } from '@/pages/siturin/interno/especialista-zonal/tramite-list/tramite-list.component';

@Component({
  selector: 'app-specialist-dashboard',
    imports: [
        TramiteListComponent
    ],
  templateUrl: './specialist-dashboard.component.html',
  styleUrl: './specialist-dashboard.component.scss'
})
export default class SpecialistDashboardComponent {

}
