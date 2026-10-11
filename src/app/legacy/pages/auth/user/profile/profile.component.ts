import {Component, OnInit} from '@angular/core';
import {BreadcrumbService, MessageService} from '@services/core';
import {AuthService} from '@services/auth';
import { Bind } from 'primeng/bind';
import { Accordion } from 'primeng/accordion';
import { PrimeTemplate } from 'primeng/api';
import { Divider } from 'primeng/divider';
import { UserInformationComponent } from '../user-information/user-information.component';
import { NgIf } from '@angular/common';
import { PasswordChangeComponent } from '../../authentication/password-change/password-change.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    imports: [Bind, Accordion, PrimeTemplate, Divider, UserInformationComponent, NgIf, PasswordChangeComponent]
})
export class ProfileComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private breadcrumbService: BreadcrumbService,
    public messageService: MessageService,
  ) {

  }

  ngOnInit(): void {
  }

}
