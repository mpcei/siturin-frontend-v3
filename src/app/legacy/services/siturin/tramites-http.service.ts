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

    this.coreService.showLoad();
    return this.httpClient.get<ServerResponsePaginator>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  devolverTramite(tramiteId: number, payload: AsignacionModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/devolver`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  obtenerArchivosInspecciones(tramiteId: number): Observable<FileModel[]> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/archivos-inspecciones`;
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data;
      })
    );
  }

  agendarTramiteUsuarioInterno(tramiteId: number, payload: InspeccionModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/agendar-usuario-interno`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  agendarTramiteUsuarioExterno(tramiteId: number, payload: InspeccionModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/agendar-usuario-externo`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteFase1(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/fase1`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        // this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteFase2(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/fase2`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        // this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteInactivacion(tramiteId: number, payload: CatalogoModel[]): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/inactivacion`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteAlojamientoContinente(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/alojamiento-continente`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteAlimentoBebidaContinente(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/alimentos-bebidas-continente`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteOperacionIntermediacionContinente(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/operacion-intermediacion-continente`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteAlojamientoGalapagos(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/alojamiento-galapagos`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteAlojamientoCertificadoInactivacion(tramiteId: number, certificadoInactivacion: FormData): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/certificado-inactivacion`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, certificadoInactivacion).pipe(
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
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteParques(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/parques`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarTramiteEventos(payload: EstablecimientoModel): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/eventos`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  guardarEstadoInspeccion(tramiteId: number, payload: FormData): Observable<TramiteModel> {
    const url = `${this.API_URL_PRIVATE}/${tramiteId}/estado-inspeccion`;
    this.coreService.showLoad();
    return this.httpClient.post<ServerResponse>(url, payload).pipe(
      map(response => {
        this.coreService.hideLoad();
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  obtenerActividadesPorZonaGeografica(zonaGeograficaId: number): Observable<CatalogoModel[]> {
    const url = `${this.API_URL_PUBLIC}/zonas-geograficas/${zonaGeograficaId}`;
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  obtenerTramitesPorEstablecimiento(establecimientoId: number): Observable<TramiteModel[]> {
    const url = `${this.API_URL_PRIVATE}/establecimientos/${establecimientoId}`;
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  obtenerTodosTramitesPorEstablecimiento(establecimientoId: number): Observable<TramiteModel[]> {
    const url = `${this.API_URL_PRIVATE}/establecimientos/${establecimientoId}/todos`;
    this.coreService.showLoad();
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => {
        this.coreService.hideLoad();
        return response.data
      })
    );
  }

  findAll(page: number = 1, search: string = ''): Observable<CatalogueModel[]> {
    const url = this.API_URL_PUBLIC;
    const headers = new HttpHeaders().append('pagination', 'true');
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
    return this.httpClient.get<ServerResponse>(url).pipe(
      map(response => response.data)
    );
  }

  update(id: string, payload: UpdateUserDto): Observable<UserModel> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    return this.httpClient.put<ServerResponse>(url, payload).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  remove(id: string): Observable<boolean> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    return this.httpClient.delete<ServerResponse>(url).pipe(
      map(response => {
        this.messageService.success(response);
        return response.data;
      })
    );
  }

  removeAll(id: CatalogueModel[]): Observable<boolean> {
    const url = `${this.API_URL_PUBLIC}/${id}`;
    return this.httpClient.delete<ServerResponse>(url).pipe(
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
    return this.httpClient.get(url, {responseType: 'blob' as 'json'});
  }

  obtenerReporteTramitesPorUsuarioInterno(usuarioInternoId: number) {
    const url = `${this.API_URL_PRIVATE}/reportes/usuario-interno/${usuarioInternoId}`;
    return this.httpClient.get(url, {responseType: 'blob' as 'json'});
  }
}
