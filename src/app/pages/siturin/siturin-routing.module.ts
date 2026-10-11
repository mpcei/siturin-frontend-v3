import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoleGuard} from '@shared/guards';
import {RolesEnum} from '@shared/enums';
import {BlankComponent} from "@layout";
import {ValidatedQuestionGuard} from "@shared/guards/validated-question.guard";

const routes: Routes = [
  {
    path: 'simulador',
    loadChildren: () => import('./simulador/simulador.module').then(m => m.SimuladorModule)
  },
  {
    path: 'externo',
    loadChildren: () => import('./externo/externo.module').then(m => m.ExternoModule),
    canActivate: [RoleGuard,ValidatedQuestionGuard],
    data: {roles: [RolesEnum.EXTERNO]}
  },
  {
    path: 'interno',
    loadChildren: () => import('./interno/interno.module').then(m => m.InternoModule),
    // canActivate: [RoleGuard],
    // data: {roles: [RolesEnum.ESPECIALISTA_ZONAL, RolesEnum.TECNICO_ZONAL, RolesEnum.DAC, RolesEnum.GAD]}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiturinRoutingModule {
}
