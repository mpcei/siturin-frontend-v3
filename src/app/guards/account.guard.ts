import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/pages/auth/auth.service';
import { MY_ROUTES } from '@routes';

export const accountGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const passwordChanged = authService.auth?.passwordChanged;

    if (!passwordChanged) {
        return router.createUrlTree([MY_ROUTES.publicPages.passwordChanged.absolute]);
    }

    if (!authService.auth?.securityQuestionAcceptedAt) {
        return router.createUrlTree([MY_ROUTES.publicPages.securityQuestions.base]);
    }

    if (!authService.auth?.termsAcceptedAt) {
        return router.createUrlTree([MY_ROUTES.publicPages.terms.base]);
    }

    return true;
};
