import {Injectable} from '@angular/core';
import {CoreService, MessageService} from '@services/core';
import {EstablecimientoModel, SelectEstablcimientoDto, TramiteModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientosService {

  constructor(
    private coreService: CoreService,
    private messageService: MessageService) {
  }

  set establecimiento(establecimiento: EstablecimientoModel) {
    localStorage.setItem('establecimiento', JSON.stringify(establecimiento));
  }

  get establecimiento(): EstablecimientoModel {
    return JSON.parse(String(localStorage.getItem('establecimiento'))) as EstablecimientoModel;
  }

  removerEstablecimiento() {
    localStorage.removeItem('establecimiento');
  }

  set tramite(tramite: TramiteModel) {
    localStorage.setItem('tramite', JSON.stringify(tramite));
  }

  get tramite(): TramiteModel {
    return JSON.parse(String(localStorage.getItem('tramite'))) as TramiteModel;
  }
}
