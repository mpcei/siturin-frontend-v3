import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}

    protected readonly environment = environment;
}
