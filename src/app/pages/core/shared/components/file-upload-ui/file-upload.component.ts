import { Component, input, output } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { PrimeIcons } from 'primeng/api';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    imports: [FileUpload],
    standalone: true
})
export class FileUploadComponent {
    accept = input<string>('application/pdf');
    uploadHandler = output();
    protected readonly PrimeIcons = PrimeIcons;

    constructor() {

    }

    onFileSelect(event: any) {
        this.uploadHandler.emit(event);
    }
}
