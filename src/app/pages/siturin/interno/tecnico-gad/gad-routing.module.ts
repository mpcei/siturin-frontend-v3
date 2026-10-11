import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SiitComponent} from "./siit/siit.component";

const routes: Routes = [
  {
    path: 'siit',
    component: SiitComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GadRoutingModule {
}
