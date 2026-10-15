import { inject } from '@angular/core';
import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '@modules/auth/auth.service';
import { switchMap } from 'rxjs';
import { AuthHttpService } from '@/pages/auth/auth-http.service';
import { AuthService as AuthServiceLegacy } from '@/legacy/services/auth/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const authServiceLegacy = inject(AuthServiceLegacy);
    const authHttpService = inject(AuthHttpService);
    let headers = req.headers ? req.headers : new HttpHeaders();
    console.log('headers', headers.get('origin'));
    console.log('headers', headers.get('origin')== 'siturin2');
    if (headers.get('origin') == 'siturin2') {
        if (authServiceLegacy.token && !headers.get('Authorization')) {
            headers = headers.append('Authorization', `Bearer ${authServiceLegacy.token.replace(/"/g, '')}`);
        }
    } else {
        if (authService.accessToken && !headers.get('Authorization')) {
            headers = headers.append('Authorization', authService.accessToken);
        }
    }

    return next(req.clone({ headers }));
};
