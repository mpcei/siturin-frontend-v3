import {Component} from '@angular/core';
import { UserListComponent } from './user-list/user-list.component';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    imports: [UserListComponent]
})
export class UserComponent {
}
