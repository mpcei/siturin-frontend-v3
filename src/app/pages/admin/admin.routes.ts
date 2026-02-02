import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import UserListComponent from '@/pages/admin/components/user/user-list/user-list.component';
import UserFormComponent from '@/pages/admin/components/user/user-form/user-form.component';
import UserProfileComponent from '@/pages/admin/components/user/user-profile/user-profile.component';

export default [
    { path: MY_ROUTES.adminPages.user.base, loadComponent: () => UserListComponent },
    { path: MY_ROUTES.adminPages.user.form.base, loadComponent: () => UserFormComponent },
    { path: MY_ROUTES.adminPages.user.form.base + '/:id', loadComponent: () => UserFormComponent },
    { path: MY_ROUTES.adminPages.user.profile.base, loadComponent: () => UserProfileComponent }
] as Routes;
