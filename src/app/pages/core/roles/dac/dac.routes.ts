import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { DacDashboardComponent } from '@modules/core/roles/dac/dac-dashboard/dac-dashboard.component';
import { CadastreDacComponent } from '@/pages/core/roles/dac/components/cadastre-dac/cadastre-dac.component';

export default [
    { path: MY_ROUTES.corePages.dac.dashboard.base, component: DacDashboardComponent },
    { path: MY_ROUTES.corePages.dac.cadastre.base, component: CadastreDacComponent },
] as Routes;
