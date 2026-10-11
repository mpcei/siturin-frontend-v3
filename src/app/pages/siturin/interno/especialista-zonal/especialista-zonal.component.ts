import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TramiteListComponent } from './tramite-list/tramite-list.component';

@Component({
    selector: 'app-especialista-zonal',
    templateUrl: './especialista-zonal.component.html',
    styleUrls: ['./especialista-zonal.component.scss'],
    imports: [TramiteListComponent]
})
export class EspecialistaZonalComponent implements OnInit {
    tramiteId: FormControl = new FormControl<number>(0);
    constructor() {}

    ngOnInit(): void {}
}
