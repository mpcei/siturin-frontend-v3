import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/pages/auth/auth.service';
import { MY_ROUTES } from '@routes';
import { CatalogueRucsTypeEnum, CatalogueTypeEnum } from '@/pages/core/shared/enums';

export const accountGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const passwordChanged = authService.auth?.passwordChanged;

    if (!passwordChanged) {
        return router.createUrlTree([MY_ROUTES.publicPages.passwordChanged.absolute]);
    }

    if (!authService.auth?.securityQuestionAcceptedAt) {
        return router.createUrlTree([MY_ROUTES.publicPages.securityQuestions.absolute]);
    }

    if (!authService.auth?.termsAcceptedAt) {
        return router.createUrlTree([MY_ROUTES.publicPages.terms.absolute]);
    }

    return true;
};
