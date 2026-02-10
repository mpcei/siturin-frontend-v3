import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/pages/auth/auth.service';

export const accountGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const passwordChanged = authService.auth?.passwordChanged;

    if (!passwordChanged) {
        return router.createUrlTree(['password-changed']);
    }

    if (!authService.auth?.securityQuestionAcceptedAt) {
        return router.createUrlTree(['security-questions']);
    }

    if (!authService.auth?.termsAcceptedAt) {
        return router.createUrlTree(['terms']);
    }

    return true;
};
