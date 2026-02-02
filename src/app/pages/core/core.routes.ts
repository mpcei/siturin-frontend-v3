import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';

export default [
    {
        path: MY_ROUTES.corePages.external.base,
        loadChildren: () => import('@modules/core/roles/external/external.routes')
    },
    {
        path: MY_ROUTES.corePages.gad.base,
        loadChildren: () => import('@modules/core/roles/gad/gad.routes')
    },
    {
        path: MY_ROUTES.corePages.dac.base,
        loadChildren: () => import('@modules/core/roles/dac/dac.routes')
    },
    {
        path: MY_ROUTES.corePages.specialist.base,
        loadChildren: () => import('@modules/core/roles/specialist/specialist.routes')
    },
    {
        path: MY_ROUTES.corePages.technician.base,
        loadChildren: () => import('@modules/core/roles/technician/technician.routes')
    },
    {
        path: MY_ROUTES.corePages.shared.base,
        loadChildren: () => import('@modules/core/shared/shared.routes')
    }
] as Routes;
