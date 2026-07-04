import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { guideGuard } from '@/guards/guide.guard';
import { guideJuridicalGuard } from '@/guards/guide-juridical.guard';

export default [
    {
        path: MY_ROUTES.corePages.external.dashboard.base,
        title: 'Dashboard',
        loadComponent: () => import('@modules/core/roles/external/components/external-dashboard/external-dashboard.component')
    },
    {
        path: MY_ROUTES.corePages.external.simulator.base,
        title: 'Simulador',
        loadComponent: () => import('@/pages/core/shared/components/regulation-simulator/regulation-simulator.component')
    },
    {
        path: MY_ROUTES.corePages.external.establishment.base,
        title: 'Estalblecimientos',
        loadComponent: () => import('@modules/core/roles/external/components/establishment-list/establishment-list.component')
    },
    {
        path: MY_ROUTES.corePages.external.accreditation.base,
        title: 'Acreditación',
        loadComponent: () => import('@/pages/core/roles/external/components/accreditation/accreditation.component')
    },
    {
        path: MY_ROUTES.corePages.external.guideEstablishment.base,
        title: 'Estalblecimientos Guías',
        canActivate: [guideJuridicalGuard],
        loadComponent: () => import('@modules/core/roles/external/components/guide-establishment-list/guide-establishment-list.component')
    },
    {
        path: MY_ROUTES.corePages.external.guideAccreditation.base,
        title: 'Acreditación Guianza',
        canActivate: [guideGuard, guideJuridicalGuard],
        loadComponent: () => import('@modules/core/roles/external/components/guide-accreditation/guide-accreditation.component')
    }
] as Routes;
