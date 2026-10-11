import {Component, OnInit} from '@angular/core';
import { Bind } from 'primeng/bind';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-access-denied',
    templateUrl: './access-denied.component.html',
    styleUrls: ['./access-denied.component.css'],
    imports: [Bind, ButtonDirective, Ripple, RouterLink]
})
export class AccessDeniedComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
}
