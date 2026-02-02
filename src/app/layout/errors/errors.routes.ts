import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { NotFoundComponent } from './not-found.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { ForbiddenComponent } from './forbidden.component';
import { UnavailableComponent } from './unavailable.component';

export default [
    { title: 'Unauthorized', path: MY_ROUTES.errorPages.unauthorized.base, component: UnauthorizedComponent },
    { title: 'Forbidden', path: MY_ROUTES.errorPages.forbidden.base, component: ForbiddenComponent },
    { title: 'Not Found', path: MY_ROUTES.errorPages.notFound.base, component: NotFoundComponent },
    { title: 'Unavailable', path: MY_ROUTES.errorPages.unavailable.base, component: UnavailableComponent }
] as Routes;
