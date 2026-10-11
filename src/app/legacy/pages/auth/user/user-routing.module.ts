import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user.component';
import {UserFormComponent} from './user-form/user-form.component';
import {ExitGuard} from '@shared/guards';
import {ProfileComponent} from "./profile/profile.component";
import {ValidatedQuestionCreateComponent} from "./validated-question-create/validated-question-create.component";

const routes: Routes = [
  {
    path: '',
    component: UserComponent
  },
  {
    path: 'validated-questions',
    component: ValidatedQuestionCreateComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: ':id',
    component: UserFormComponent,
    canDeactivate: [ExitGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
