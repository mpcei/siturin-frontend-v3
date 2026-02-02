import { Component, inject } from '@angular/core';
import { AuthService } from '@modules/auth/auth.service';
import { RoleEnum } from '@utils/enums';
import { BreadcrumbService } from '@layout/service';
import { OwnerDashboardComponent } from '@/pages/core/roles/owner/owner-dashboard/owner-dashboard.component';
import AdminDashboardComponent from '@/pages/admin/components/admin-dashboard/admin-dashboard.component';

@Component({
    selector: 'app-dashboards',
    imports: [AdminDashboardComponent, OwnerDashboardComponent],
    template: `
        @if (authService.role) {
            @switch (authService.role.code) {
                @case (RoleEnum.ADMIN) {
                    <app-admin-dashboard />
                }
                @case (RoleEnum.OWNER) {
                    <app-owner-dashboard />
                }
            }
        }
    `,
    styleUrl: './dashboards.component.scss'
})
export class DashboardsComponent {
    protected readonly authService = inject(AuthService);
    protected readonly RoleEnum = RoleEnum;
    private readonly _breadcrumbService = inject(BreadcrumbService);

    constructor() {
        this._breadcrumbService.setItems([{ label: 'Dashboard' }]);
    }
}
