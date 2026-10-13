import { Component } from '@angular/core';
import GuideEstablishmentListComponent
    from '@/pages/core/roles/external/components/guide-establishment-list/guide-establishment-list.component';

@Component({
  selector: 'app-external-dashboard',
    imports: [
        GuideEstablishmentListComponent
    ],
  templateUrl: './external-dashboard.component.html',
  styleUrl: './external-dashboard.component.scss'
})
export default class ExternalDashboardComponent {

}
