import {Component, OnInit} from '@angular/core';
import {PersoneriaJuridicaModel} from '@models/siturin';
import { ActividadTuristicaComponent } from './actividad-turistica/actividad-turistica.component';

@Component({
    selector: 'app-simulador',
    templateUrl: './simulador.component.html',
    styleUrls: ['./simulador.component.scss'],
    imports: [ActividadTuristicaComponent]
})
export class SimuladorComponent implements OnInit {
  personeriaJuridica: PersoneriaJuridicaModel = {};

  constructor() {
  }

  ngOnInit(): void {
  }

}
