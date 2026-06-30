import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import TechnicianDashboardComponent from '@modules/core/roles/technician/technician-dashboard/technician-dashboard.component';
import ProcessComponent from '@modules/core/roles/guide-technician/process/process.component';
import RegulationSimulatorComponent from '@/pages/core/shared/components/regulation-simulator/regulation-simulator.component';

export default [
    {
        path: MY_ROUTES.corePages.guideTechnician.dashboard.base,
        component: TechnicianDashboardComponent
    },
    {
        path: MY_ROUTES.corePages.guideTechnician.simulator.base,
        component: RegulationSimulatorComponent
    },
    {
        path: MY_ROUTES.corePages.guideTechnician.process.base,
        component: ProcessComponent
    },
    {
        path: MY_ROUTES.corePages.guideTechnician.cadastre.base,
        component: ProcessComponent
    }
] as Routes;
