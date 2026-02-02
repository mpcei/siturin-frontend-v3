import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';

export default [
    { path: MY_ROUTES.authPages.signIn.base, loadComponent: () => import('./components/sign-in/sign-in.component') },
    { path: MY_ROUTES.authPages.signUp.base, loadComponent: () => import('./components/sign-up/sign-up.component') },
    {
        path: MY_ROUTES.authPages.passwordReset.base,
        loadComponent: () => import('./components/password-reset/password-reset.component')
    }
] as Routes;
