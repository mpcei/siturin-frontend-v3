import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';

@Component({
    selector: 'app-download-documents',
    imports: [Dialog, ButtonModule, Fluid],
    templateUrl: './download-documents.component.html',
    styleUrl: './download-documents.component.scss'
})
export class DownloadDocumentsComponent {
    visible: boolean = false;

    showDialog() {
        this.visible = true;
    }

    protected readonly PrimeIcons = PrimeIcons;
}
