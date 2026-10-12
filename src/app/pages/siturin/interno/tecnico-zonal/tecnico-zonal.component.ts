import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import { TramiteListComponent } from './tramite-list/tramite-list.component';

@Component({
    host: { class: 'siturin-legacy' },
    selector: 'app-tecnico-zonal',
    templateUrl: './tecnico-zonal.component.html',
    styleUrls: ['./tecnico-zonal.component.scss'],
    imports: [TramiteListComponent]
})
export class TecnicoZonalComponent implements OnInit {
  tramiteId: FormControl = new FormControl<number>(0);

  constructor() {
  }

  ngOnInit(): void {
  }

}
