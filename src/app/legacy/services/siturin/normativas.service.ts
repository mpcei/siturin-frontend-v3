import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import { CoreService } from '../core';

@Injectable({
  providedIn: 'root'
})
export class NormativasService {
  private modelo = new BehaviorSubject<{ id: number, tipo: string }>({id: 0, tipo: ''});
  public modelo$ = this.modelo.asObservable();

  private modeloServiciosComplementarios = new BehaviorSubject<{ id: number, tipo: string }>({id: 0, tipo: ''});
  public modeloServiciosComplementarios$ = this.modeloServiciosComplementarios.asObservable();

  constructor(
    private coreService: CoreService) {
  }

  setModelo(id: number, tipo: string): void {
    this.modelo.next({id, tipo});
  }

  setModeloServiciosComplementarios(id: number, tipo: string): void {
    this.modeloServiciosComplementarios.next({id, tipo});
  }
}
