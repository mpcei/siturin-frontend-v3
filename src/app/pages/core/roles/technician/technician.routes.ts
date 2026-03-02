import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import TechnicianDashboardComponent from '@modules/core/roles/technician/technician-dashboard/technician-dashboard.component';
import ProcessComponent from '@modules/core/roles/technician/process/process.component';
import RegulationSimulatorComponent from '@/pages/core/shared/components/regulation-simulator/regulation-simulator.component';

export default [
    {
        path: MY_ROUTES.corePages.technician.dashboard.base,
        component: TechnicianDashboardComponent
    },
    {
        path: MY_ROUTES.corePages.technician.simulator.base,
        component: RegulationSimulatorComponent
    },
    {
        path: MY_ROUTES.corePages.technician.process.base,
        component: ProcessComponent
    }
] as Routes;
