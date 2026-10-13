import { Component } from '@angular/core';
import { CatastroListComponent } from '@/pages/siturin/interno/catastro/catastro-list/catastro-list.component';

@Component({
    selector: 'app-gad-dashboard',
    imports: [
        CatastroListComponent
    ],
    templateUrl: './gad-dashboard.component.html',
    styleUrl: './gad-dashboard.component.scss'
})
export default class GadDashboardComponent {}
