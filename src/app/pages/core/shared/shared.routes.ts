import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { RegulationSimulatorComponent } from '@modules/core/shared/components/regulation-simulator/regulation-simulator.component';

export default [
    {
        path: MY_ROUTES.corePages.shared.simulator.base,
        component: RegulationSimulatorComponent
    }
] as Routes;
