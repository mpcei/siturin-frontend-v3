import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SimuladorComponent} from './simulador.component';

const routes: Routes = [
  {
    path: '',
    component: SimuladorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimuladorRoutingModule {
}
