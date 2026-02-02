import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { ExternalDashboardComponent } from '@modules/core/roles/external/components/external-dashboard/external-dashboard.component';
import { AccreditationComponent } from '@modules/core/roles/external/components/accreditation/accreditation.component';
import { EstablishmentListComponent } from '@modules/core/roles/external/components/establishment-list/establishment-list.component';

export default [
    { path: MY_ROUTES.corePages.external.dashboard.base, component: ExternalDashboardComponent },
    { path: MY_ROUTES.corePages.external.establishment.base, component: EstablishmentListComponent },
    { path: MY_ROUTES.corePages.external.accreditation.base, component: AccreditationComponent }
] as Routes;
