import { Component } from '@angular/core';
import { CatastroListComponent } from '@/pages/siturin/interno/catastro/catastro-list/catastro-list.component';

@Component({
    selector: 'app-dac-dashboard',
    imports: [
        CatastroListComponent
    ],
    templateUrl: './dac-dashboard.component.html',
    styleUrl: './dac-dashboard.component.scss'
})
export default class DacDashboardComponent {}
