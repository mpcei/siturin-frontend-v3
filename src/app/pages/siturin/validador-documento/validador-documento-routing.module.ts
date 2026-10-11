import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ValidadorDocumentoComponent} from './validador-documento.component';

const routes: Routes = [
  {
    path: '',
    component: ValidadorDocumentoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidadorDocumentoRoutingModule {
}
