import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EstablecimientoListComponent} from './establecimiento-list/establecimiento-list.component';
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: 'proceso-acreditacion',
    loadChildren: () => import('./proceso-acreditacion/proceso-acreditacion.module').then(m => m.ProcesoAcreditacionModule)
  },
  {
    path: 'establecimientos',
    component: EstablecimientoListComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];
// const routes: Routes = [
//   {
//     path: 'proceso-acreditacion',
//     loadChildren: () => import('./proceso-acreditacion/proceso-acreditacion.module').then(m => m.ProcesoAcreditacionModule)
//   },
//   {
//     path: 'establecimientos',
//     component: EstablecimientoListComponent
//   },
//   {
//     path: 'dashboard',
//     component: DashboardComponent
//   }
// ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternoRoutingModule {
}
