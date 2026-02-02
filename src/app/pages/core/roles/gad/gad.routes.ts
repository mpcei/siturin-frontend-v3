import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { GadDashboardComponent } from '@modules/core/roles/gad/gad-dashboard/gad-dashboard.component';
import { CadastreDacComponent } from '@/pages/core/roles/dac/components/cadastre-dac/cadastre-dac.component';

export default [
    { path: MY_ROUTES.corePages.gad.dashboard.base, component: GadDashboardComponent },
    { path: MY_ROUTES.corePages.gad.cadastre.base, component: CadastreDacComponent }
] as Routes;
