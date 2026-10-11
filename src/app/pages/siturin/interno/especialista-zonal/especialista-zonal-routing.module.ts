import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {EspecialistaZonalComponent} from './especialista-zonal.component';

const routes: Routes = [
  {
    path: '',
    component: EspecialistaZonalComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspecialistaZonalRoutingModule { }
