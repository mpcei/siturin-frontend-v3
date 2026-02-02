import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { ManagerDashboardComponent } from '@modules/core/manager/manager-dashboard/manager-dashboard.component';
import { ProjectComponent } from '@modules/core/manager/project/project.component';

export default [
    { path: MY_ROUTES.corePages.manager.dashboard.base, component: ManagerDashboardComponent },
    { path: MY_ROUTES.corePages.manager.project.base, component: ProjectComponent },
] as Routes;
