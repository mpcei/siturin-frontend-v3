import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcesoAcreditacionComponent } from './proceso-acreditacion.component';
import { TarifarioRackComponent } from './tarifario-rack/tarifario-rack.component';

const routes: Routes = [
    {
        path: '',
        component: ProcesoAcreditacionComponent
    },
    {
        path: 'tarifario-rack',
        component: TarifarioRackComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProcesoAcreditacionRoutingModule {}
