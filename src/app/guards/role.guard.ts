import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@/pages/auth/auth.service';
import { RoleInterface } from '@/pages/auth/interfaces';

export const roleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.auth) {
        return router.createUrlTree(['/common/403']);
    }

    const authRole: RoleInterface = authService.role;

    if (authRole) {
        for (const role of route.data['roles']) {
            if (role.toUpperCase() === authRole.code.toUpperCase()) return true;
        }
    }

    return router.createUrlTree(['/common/403']);
};
