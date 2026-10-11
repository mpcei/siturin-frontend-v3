import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from "./dashboard/dashboard.component";

const routes: Routes = [
  {
    path: 'tecnico-zonal',
    loadChildren: () => import('./tecnico-zonal/tecnico-zonal.module').then(m => m.TecnicoZonalModule)
  },
  {
    path: 'especialista-zonal',
    loadChildren: () => import('./especialista-zonal/especialista-zonal.module').then(m => m.EspecialistaZonalModule)
  },
  {
    path: 'catastros-dac',
    loadChildren: () => import('./catastro/catastro.module').then(m => m.CatastroModule)
  },
  {
    path: 'catastros-gad',
    loadChildren: () => import('./catastro/catastro.module').then(m => m.CatastroModule)
  },
  {
    path: 'catastros-zonal',
    loadChildren: () => import('./catastro/catastro.module').then(m => m.CatastroModule)
  },
  {
    path: 'bitacora',
    loadChildren: () => import('./bitacora/bitacora.module').then(m => m.BitacoraModule)
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternoRoutingModule {
}
