import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { tokenGuard } from '@guards';

export default [
    {
        path: MY_ROUTES.publicPages.emailVerification.base,
        title:'Verificación Email',
        loadComponent: () => import('@modules/auth/components/email-verification/email-verification.component')
    },
    {
        path: MY_ROUTES.publicPages.simulator.base,
        title:'Simulador',
        loadComponent: () => import('@modules/core/shared/components/regulation-simulator/regulation-simulator.component') },
    {
        path: MY_ROUTES.publicPages.terms.base,
        title:'Términos y Condiciones',
        loadComponent:()=> import('@modules/auth/components/terms/terms.component'),
        canActivate: [tokenGuard]
    },
    {
        path: MY_ROUTES.publicPages.icons.base,
        title:'Icons',
        loadComponent: ()=>import('./icons/font-awesome-icons')
    },
    {
        path: MY_ROUTES.publicPages.passwordChanged.base,
        title:'Cambio de Contraseña',
        loadComponent:()=> import('@modules/auth/components/password-changed/password-changed.component'),
        canActivate: [tokenGuard]
    },

    {
        path: MY_ROUTES.publicPages.securityQuestions.base,
        title:'Preguntas de Seguridad',
        loadComponent:()=> import('@modules/auth/components/security-question/security-question.component'),
        canActivate: [tokenGuard]
    },
] as Routes;
