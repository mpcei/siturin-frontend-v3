import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import TechnicianDashboardComponent from '@modules/core/roles/guide-technician/guide-technician-dashboard/guide-technician-dashboard.component';
import ProcessComponent from '@modules/core/roles/guide-technician/process/process.component';
import RegulationSimulatorComponent from '@/pages/core/shared/components/regulation-simulator/regulation-simulator.component';
import { ChecklistComponent } from '@/pages/core/roles/guide-technician/process/checklist/checklist.component';

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
    },
    {
        path: MY_ROUTES.corePages.guideTechnician.checklist.base+'/:processId/:isCurrent',
        component: ChecklistComponent
    }
] as Routes;
