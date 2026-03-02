import { Component, inject } from '@angular/core';
import { AuthService } from '@modules/auth/auth.service';
import { RoleEnum } from '@utils/enums';
import { BreadcrumbService } from '@layout/service';
import AdminDashboardComponent from '@/pages/admin/components/admin-dashboard/admin-dashboard.component';
import TechnicianDashboardComponent from '@/pages/core/roles/technician/technician-dashboard/technician-dashboard.component';
import SpecialistDashboardComponent from '@/pages/core/roles/specialist/specialist-dashboard/specialist-dashboard.component';
import DacDashboardComponent from '@/pages/core/roles/dac/dac-dashboard/dac-dashboard.component';
import GadDashboardComponent from '@/pages/core/roles/gad/gad-dashboard/gad-dashboard.component';
import ExternalDashboardComponent from '@/pages/core/roles/external/components/external-dashboard/external-dashboard.component';

@Component({
    selector: 'app-dashboards',
    imports: [AdminDashboardComponent, ExternalDashboardComponent, TechnicianDashboardComponent, SpecialistDashboardComponent, DacDashboardComponent, GadDashboardComponent],
    template: `
        @if (authService.role) {
            @switch (authService.role.code) {
                @case (RoleEnum.ADMIN) {
                    <app-admin-dashboard />
                }
                @case (RoleEnum.EXTERNAL) {
                    <app-external-dashboard />
                }
                @case (RoleEnum.TECHNICIAN) {
                    <app-technician-dashboard />
                }
                @case (RoleEnum.SPECIALIST) {
                    <app-specialist-dashboard />
                }
                @case (RoleEnum.DAC) {
                    <app-dac-dashboard />
                }
                @case (RoleEnum.GAD) {
                    <app-gad-dashboard />
                }
            }
        }
    `,
    styleUrl: './dashboards.component.scss'
})
export default class DashboardsComponent {
    protected readonly authService = inject(AuthService);
    protected readonly RoleEnum = RoleEnum;
    private readonly _breadcrumbService = inject(BreadcrumbService);

    constructor() {
        this._breadcrumbService.setItems([{ label: 'Dashboard' }]);
    }
}
