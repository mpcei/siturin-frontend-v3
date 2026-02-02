import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';

export default [
    { path: MY_ROUTES.adminPages.base, loadChildren: () => import('./admin/admin.routes') },
    { path: MY_ROUTES.corePages.base, loadChildren: () => import('./core/core.routes') },
    { path: MY_ROUTES.publicPages.base, loadChildren: () => import('./public/public.routes') },
] as Routes;
