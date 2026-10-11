import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ConsultaCatastroComponent} from './consulta-catastro.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultaCatastroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaCatastroRoutingModule {
}
