import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { UserListContainerComponent } from './components/user-list/user-list-container';
import { ProceduresListContainerComponent } from './components/procedures-list/procedures-list-container';

export default [
    {
        path: MY_ROUTES.corePages.internal.dashboard.base,
        title: 'Simulador',
        loadComponent: ()=> UserListContainerComponent
    },
    {
        path: MY_ROUTES.corePages.internal.process.base,
        title: 'Simulador',
        loadComponent: ()=> ProceduresListContainerComponent
    },
] as Routes;
