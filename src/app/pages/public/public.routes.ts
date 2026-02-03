import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import EmailVerificationComponent from '@/pages/auth/components/email-verification/email-verification.component';
import RegulationSimulatorComponent
    from '@/pages/core/shared/components/regulation-simulator/regulation-simulator.component';

export default [
    { path: MY_ROUTES.publicPages.emailVerification.base, loadComponent: () => EmailVerificationComponent },
    { path: MY_ROUTES.publicPages.simulator.base, loadComponent: () => RegulationSimulatorComponent },
] as Routes;
