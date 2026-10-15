import { Routes } from '@angular/router';
import DashboardsComponent from '@/pages/dashboards/dashboards.component';

export default [
    {
        path: '',
        title: 'SITURIN V3',
        loadComponent:()=> DashboardsComponent
    }
] as Routes;
