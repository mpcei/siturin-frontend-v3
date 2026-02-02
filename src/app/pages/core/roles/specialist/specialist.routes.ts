import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { SpecialistDashboardComponent } from '@modules/core/roles/specialist/specialist-dashboard/specialist-dashboard.component';
import { CadastreDacComponent } from '@/pages/core/roles/dac/components/cadastre-dac/cadastre-dac.component';

export default [
    {
        path: MY_ROUTES.corePages.specialist.dashboard.base,
        component: SpecialistDashboardComponent
    },
    { path: MY_ROUTES.corePages.specialist.cadastre.base, component: CadastreDacComponent }
] as Routes;
