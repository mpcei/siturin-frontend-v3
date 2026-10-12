import { RolesEnum } from '@/legacy/shared/enums';
import { RoleGuard } from '@/legacy/shared/guards';
import { ValidatedQuestionGuard } from '@/legacy/shared/guards/validated-question.guard';
import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';

const externoGuards = {
};

export default [
    // siturin-routing.module.ts -> simulador
    {
        path: MY_ROUTES.siturinPage.simulador.base,
        loadComponent: () => import('./simulador/simulador.component').then((m) => m.SimuladorComponent)
    },

    // externo-routing.module.ts y proceso-acreditacion-routing.module.ts
    {
        path: MY_ROUTES.siturinPage.externo.procesoAcreditacion.base,
        loadComponent: () => import('./externo/proceso-acreditacion/proceso-acreditacion.component').then((m) => m.ProcesoAcreditacionComponent),
        ...externoGuards
    },
    {
        path: MY_ROUTES.siturinPage.externo.tarifarioRack.base,
        loadComponent: () => import('./externo/proceso-acreditacion/tarifario-rack/tarifario-rack.component').then((m) => m.TarifarioRackComponent),
        ...externoGuards
    },
    {
        path: MY_ROUTES.siturinPage.externo.establecimientos.base,
        loadComponent: () => import('./externo/establecimiento-list/establecimiento-list.component').then((m) => m.EstablecimientoListComponent),
        ...externoGuards
    },
    {
        path: MY_ROUTES.siturinPage.externo.dashboard.base,
        loadComponent: () => import('./externo/dashboard/dashboard.component').then((m) => m.DashboardComponent),
        ...externoGuards
    },

    // interno-routing.module.ts (en el viejo el guard de interno estaba comentado, se deja igual)
    {
        path: MY_ROUTES.siturinPage.interno.tecnicoZonal.base,
        loadComponent: () => import('./interno/tecnico-zonal/tecnico-zonal.component').then((m) => m.TecnicoZonalComponent)
    },
    {
        path: MY_ROUTES.siturinPage.interno.especialistaZonal.base,
        loadComponent: () => import('./interno/especialista-zonal/especialista-zonal.component').then((m) => m.EspecialistaZonalComponent)
    },
    {
        path: MY_ROUTES.siturinPage.interno.catastrosDac.base,
        loadComponent: () => import('./interno/catastro/catastro.component').then((m) => m.CatastroComponent)
    },
    {
        path: MY_ROUTES.siturinPage.interno.catastrosGad.base,
        loadComponent: () => import('./interno/catastro/catastro.component').then((m) => m.CatastroComponent)
    },
    {
        path: MY_ROUTES.siturinPage.interno.catastrosZonal.base,
        loadComponent: () => import('./interno/catastro/catastro.component').then((m) => m.CatastroComponent)
    },
    {
        path: MY_ROUTES.siturinPage.interno.bitacora.base,
        loadComponent: () => import('./interno/bitacora/bitacora.component').then((m) => m.BitacoraComponent)
    },
    {
        path: MY_ROUTES.siturinPage.interno.dashboard.base,
        loadComponent: () => import('./interno/dashboard/dashboard.component').then((m) => m.DashboardComponent)
    }
] as Routes;
