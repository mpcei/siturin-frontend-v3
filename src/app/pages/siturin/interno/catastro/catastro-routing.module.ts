import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CatastroComponent} from './catastro.component';

const routes: Routes = [
  {
    path: '',
    component: CatastroComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatastroRoutingModule {
}
