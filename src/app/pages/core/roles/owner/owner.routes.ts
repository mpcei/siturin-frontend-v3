import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { Appointments } from '@/pages/core/roles/owner/components/appointments/appointments';
import { OwnerDashboardComponent } from '@/pages/core/roles/owner/owner-dashboard/owner-dashboard.component';


export default [
    {
        path: MY_ROUTES.corePages.owner.dashboard.base,
        component: OwnerDashboardComponent
    },
    {
        path: MY_ROUTES.corePages.owner.appointments.base,
        component: Appointments
    }
] as Routes;
