import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { AppLayoutMain } from '@layout/component/app.layout-main';
import { AppLayoutBlank } from '@layout/component/app.layout-blank';
import { AppLayoutAuth } from '@layout/component/app.layout-auth';
import { tokenGuard } from '@/guards/token.guard';
import { accountGuard } from '@/guards/account.guard';
import SecurityQuestionComponent from '@/pages/auth/components/security-question/security-question.component';
import FontAwesomeIcons from '@/api/font-awesome-icons';
import PasswordChangedComponent from '@/pages/auth/components/password-changed/password-changed.component';

export const appRoutes: Routes = [
    {
        path: MY_ROUTES.main,
        component: AppLayoutMain,
        canActivate: [tokenGuard, accountGuard],
        children: [
            { path: MY_ROUTES.dashboards.base, loadChildren: () => import('./app/pages/dashboards/dashboard.routes') },
            { path: MY_ROUTES.adminPages.base, loadChildren: () => import('./app/pages/admin/admin.routes') },
            { path: MY_ROUTES.corePages.base, loadChildren: () => import('./app/pages/core/core.routes') }
        ]
    },

    {
        path: MY_ROUTES.errorPages.base,
        component: AppLayoutBlank,
        children: [{ path: '', loadChildren: () => import('./app/layout/errors/errors.routes') }]
    },

    {
        path: MY_ROUTES.authPages.base,
        component: AppLayoutAuth,
        children: [{ path: '', loadChildren: () => import('./app/pages/auth/auth.routes') }]
    },

    {
        path: MY_ROUTES.publicPages.base,
        component: AppLayoutBlank,
        children: [{ path: '', loadChildren: () => import('./app/pages/public/public.routes') }]
    },

    {
        path: 'security-questions',
        component: SecurityQuestionComponent,
        canActivate: [tokenGuard]
    },

    {
        path: 'password-changed',
        component: PasswordChangedComponent,
        canActivate: [tokenGuard]
    },

    {
        path: 'api',
        component: FontAwesomeIcons
    },

    { path: '', redirectTo: '/main/dashboards', pathMatch: 'full' },

    { path: '**', redirectTo: MY_ROUTES.errorPages.notFound.absolute }
];
