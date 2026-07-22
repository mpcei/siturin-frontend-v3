import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import TechnicianDashboardComponent from '@modules/core/roles/director/director-dashboard/director-dashboard.component';
import ProcessComponent from '@modules/core/roles/director/process/process.component';
import RegulationSimulatorComponent from '@/pages/core/shared/components/regulation-simulator/regulation-simulator.component';
import { ChecklistComponent } from '@/pages/core/roles/director/process/checklist/checklist.component';

export default [
    {
        path: MY_ROUTES.corePages.director.dashboard.base,
        component: TechnicianDashboardComponent
    },
    {
        path: MY_ROUTES.corePages.director.simulator.base,
        component: RegulationSimulatorComponent
    },
    {
        path: MY_ROUTES.corePages.director.process.base,
        component: ProcessComponent
    },
    {
        path: MY_ROUTES.corePages.director.cadastre.base,
        component: ProcessComponent
    },
    {
        path: MY_ROUTES.corePages.director.checklist.base+'/:processId',
        component: ChecklistComponent
    }
] as Routes;
