import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TecnicoZonalComponent} from './tecnico-zonal.component';

const routes: Routes = [
  {
    path: '',
    component: TecnicoZonalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TecnicoZonalRoutingModule {
}
