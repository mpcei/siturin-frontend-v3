import { PaginatorModel } from '@/legacy/models/core';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CoreService {
    private loaded = new BehaviorSubject<boolean>(false);
    public loaded$ = this.loaded.asObservable();
    private paginatorModel = new BehaviorSubject<PaginatorModel>(this.paginator);
    public paginator$ = this.paginatorModel.asObservable();

    constructor() {}

    paginate(paginator: PaginatorModel): void {
        this.paginatorModel.next(paginator);
    }

    showLoad(): void {
        this.loaded.next(true);
    }

    hideLoad(): void {
        this.loaded.next(false);
    }

    get paginator(): PaginatorModel {
        return { page: 1, limit: 10, totalItems: 0, firstItem: 1, lastPage: 1, lastItem: 1 };
    }

    descargarDocumentoPDF(documento: any, nombreDocumento: string) {
        const binaryData = [] as BlobPart[];
        binaryData.push(documento as BlobPart);
        const filePath = URL.createObjectURL(new Blob(binaryData, { type: 'pdf' }));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        downloadLink.setAttribute('download', nombreDocumento + '.pdf');
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    descargarDocumentoXLSX(documento: any, nombreDocumento: string) {
        const binaryData = [] as BlobPart[];
        binaryData.push(documento as BlobPart);
        const filePath = URL.createObjectURL(new Blob(binaryData, { type: 'xlsx' }));
        const downloadLink = document.createElement('a');
        downloadLink.href = filePath;
        downloadLink.setAttribute('download', nombreDocumento + '.xlsx');
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    get version(): string | null {
        return localStorage.getItem('version');
    }

    set version(value: string | undefined | null) {
        localStorage.setItem('version', JSON.stringify(value));
    }
}
