import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SyncRucComponent} from "./sync-ruc/sync-ruc.component";

const routes: Routes = [
  {
    path: 'sync-rucs',
    component: SyncRucComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}
