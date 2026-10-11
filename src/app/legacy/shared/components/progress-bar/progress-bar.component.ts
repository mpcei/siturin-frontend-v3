import {Component, Input, OnInit} from '@angular/core';
import { Bind } from 'primeng/bind';
import { ProgressBar } from 'primeng/progressbar';

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss'],
    imports: [Bind, ProgressBar]
})
export class ProgressBarComponent {
  @Input() message: string = 'Por favor espere...';

  constructor() {
  }

}
