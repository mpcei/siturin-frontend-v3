import {Injectable} from '@angular/core';
import {environment} from '@env/environment';
import {BehaviorSubject} from 'rxjs';
import {CoreService, MessageService} from '@services/core';
import {PaginatorModel} from '@models/core';
import {DpaModel} from '@models/siturin';
import {DpaHttpService} from '@services/siturin/dpa-http.service';

@Injectable({
  providedIn: 'root'
})
export class DpaService {
  API_URL_PUBLIC = `${environment.API_URL_PUBLIC}/dpa`;
  private pagination = new BehaviorSubject<PaginatorModel>(this.coreService.paginator);
  public pagination$ = this.pagination.asObservable();

  constructor(
    private coreService: CoreService,
    private dpaHttpService: DpaHttpService,
    private messageService: MessageService) {
  }

  set dpa(dpa: DpaModel[]) {
    localStorage.setItem('dpa', JSON.stringify(dpa));
  }

  get dpa(): DpaModel[] {
    return JSON.parse(String(localStorage.getItem('dpa'))) as DpaModel[];
  }

  obtenerProvinciasPorZonal(zonalId: number): DpaModel[] {
    console.log('zonalId', zonalId);
    const dpa = JSON.parse(String(localStorage.getItem('dpa'))) as DpaModel[];
    return dpa.filter(dpa => dpa?.zonal?.id === zonalId);
  }

  verificarDpa() {
    if (!this.dpa) {
      this.dpaHttpService.obtenerDpa().subscribe((dpa) => {
        this.dpa = dpa;
      });
    }
  }
}
