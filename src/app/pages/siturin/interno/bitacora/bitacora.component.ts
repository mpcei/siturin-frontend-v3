import {Component, OnInit} from '@angular/core';
import { EstablecimientosComponent } from './establecimientos/establecimientos.component';

@Component({
    selector: 'app-bitacora',
    templateUrl: './bitacora.component.html',
    styleUrls: ['./bitacora.component.scss'],
    imports: [EstablecimientosComponent]
})
export class BitacoraComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
