import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {UpdateUserDto, UserModel} from '@models/auth';
import {map} from 'rxjs/operators';
import {ServerResponse, ServerResponsePaginator} from '@models/http-response';
import {CoreService, MessageService} from '@services/core';
import {CatalogueModel, FileModel, PaginatorModel} from '@models/core';
import {
  AsignacionModel,
  CatalogoModel, CatastroModel,
  DpaModel,
  EstablecimientoModel,
  InspeccionModel,
  TramiteModel
} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class TramitesHttpService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/tramites`;
  API_URL_PRIVATE = `${environment.API_URL_PRIVATE}/tramites`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(private httpClient: HttpClient,
              private coreService: CoreService,
              private messageService: MessageService) {
  }

  obtenerTramiteCatastroSeleccionado(tramiteId: number = 0): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/catastros/seleccionado`;
    const headers = new HttpHeaders().append('origin', 'siturin2');

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponsePaginator>(url, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  devolverTramite(tramiteId: number, payload: AsignacionModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/devolver`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  obtenerArchivosInspecciones(tramiteId: number): Observable<FileModel[]> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/archivos-inspecciones`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  agendarTramiteUsuarioInterno(tramiteId: number, payload: InspeccionModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/agendar-usuario-interno`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  agendarTramiteUsuarioExterno(tramiteId: number, payload: InspeccionModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/agendar-usuario-externo`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteFase1(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/fase1`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        // this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteFase2(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/fase2`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        // this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteInactivacion(tramiteId: number, payload: CatalogoModel[]): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/inactivacion`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteAlojamientoContinente(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/alojamiento-continente`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteAlimentoBebidaContinente(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/alimentos-bebidas-continente`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteOperacionIntermediacionContinente(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/operacion-intermediacion-continente`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteAlojamientoGalapagos(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/alojamiento-galapagos`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteAlojamientoCertificadoInactivacion(tramiteId: number, certificadoInactivacion: FormData): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/certificado-inactivacion`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, certificadoInactivacion, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteTransporte(payload: any): Observable<TramiteModel> {
    return of({});
    const url = `${this.API_URL_PRIVATE}/transportes`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteParques(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/parques`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteEventos(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/eventos`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarEstadoInspeccion(tramiteId: number, payload: FormData): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/estado-inspeccion`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  obtenerActividadesPorZonaGeografica(zonaGeograficaId: number): Observable<CatalogoModel[]> {
    const url = `${this.API_URL_PUBLIC}/zonas-geograficas/${zonaGeograficaId}`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  obtenerTramitesPorEstablecimiento(establecimientoId: number): Observable<TramiteModel[]> {
    const url = `${this.API_URL_PRIVATE}/establecimientos/${establecimientoId}`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  obtenerTodosTramitesPorEstablecimiento(establecimientoId: number): Observable<TramiteModel[]> {
    const url = `${this.API_URL_PRIVATE}/establecimientos/${establecimientoId}/todos`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers}).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  findAll(page: number = 1, search: string = ''): Observable<CatalogueModel[]> {
    const url = this.API_URL_PUBLIC;
    const headers = new HttpHeaders().append('pagination', 'true').append('origin','siturin2');
    const params = new HttpParams().append('page', page).append('search', search);
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url, {headers, params}).pipe(
      map(response => {
        this.coreService.hideLoad();
        if (response.pagination) {
          this.pagination.next(response.pagination);
        }
        return response.data;
      })
    );
  }

  findOne(id: string): Observable<UserModel> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    return this.httpClient.get<ServerResponse>(url, {headers}).pipe(
      map(response => response.data)
    );
  }

  update(id: string, payload: UpdateUserDto): Observable<UserModel> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    return this.httpClient.put<ServerResponse>(url, payload, {headers}).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<boolean> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    return this.httpClient.delete<ServerResponse>(url, {headers}).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(id: CatalogueModel[]): Observable<boolean> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    return this.httpClient.delete<ServerResponse>(url, {headers}).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  descargarDocumento(catastroId: number, codigoDocumento: string) {
    this.obtenerDocumento(catastroId, codigoDocumento).subscribe(response => {
      const binaryData = [] as BlobPart[];
      binaryData.push(response as BlobPart);
      const filePath = URL.createObjectURL(new Blob(binaryData, {type: 'pdf'}));
      const downloadLink = document.createElement('a');
      downloadLink.href = filePath;
      downloadLink.setAttribute('download', codigoDocumento);
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
  }

  obtenerDocumento(catastroId: number, codigo: string) {
    const url = `${this.API_URL_PRIVATE}/${catastroId}/documentos/${codigo}/descargar`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    return this.httpClient.get(url, {responseType: 'blob' as 'json', headers});
  }

  obtenerReporteTramitesPorUsuarioInterno(usuarioInternoId: number) {
    const url = `${this.API_URL_PRIVATE}/reportes/usuario-interno/${usuarioInternoId}`;
    const headers = new HttpHeaders().append('origin', 'siturin2');
    return this.httpClient.get(url, {responseType: 'blob' as 'json', headers});
  }
}
