import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { Appointment } from '@/pages/public/appointment/appointment';

export default [
    { path: MY_ROUTES.publicPages.appointments.base, component: Appointment },
    { path: MY_ROUTES.publicPages.emailVerification.base, loadComponent: () => import('../auth/components/email-verification/email-verification.component') },
] as Routes;
