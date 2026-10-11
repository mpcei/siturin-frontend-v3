import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ServerResponse} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {FileModel, PaginatorModel} from '@models/core';

@Injectable({
  providedIn: 'root'
})
export class CoreHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/files`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/files`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  uploadFiles(url: string, data: FormData, params = new HttpParams()): Observable<ServerResponse> {
    url = this.API_URL_PRIVATE + url;
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    return this.httpClient.post<ServerResponse>(url, data, {params, headers})
      .pipe(
        map(response => response)
      );
  }

  downloadFile(file: FileModel) {
    this.getFile(file.id!).subscribe(response => {
      const binaryData = [] as BlobPart[];
      binaryData.push(response as BlobPart);
      const filePath = URL.createObjectURL(new Blob(binaryData, {type: 'pdf'}));
      const downloadLink = document.createElement('a');
      downloadLink.href = filePath;
      downloadLink.setAttribute('download', file.fullName!);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }

  getFile(fileId: number, params = new HttpParams()) {
    const url = `${this.API_URL_PRIVATE}/${fileId}/download`;
    return this.httpClient.get(url, {params, responseType: 'blob' as 'json'});
  }

  deleteFiles(ids: (number | undefined)[], params = new HttpParams()): Observable<ServerResponse> {
    const url = this.API_URL_PRIVATE + '/destroys';
    return this.httpClient.patch<ServerResponse>(url, {ids}, {params})
      .pipe(
        map(response => response)
      );
  }

  checkVersion() {
    const url = `${environment.API_URL_PUBLIC}/version`;
    return this.httpClient.get(url);
  }
}
