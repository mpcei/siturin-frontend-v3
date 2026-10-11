import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

export enum AppRoutesEnum {
  CORE = '/core',
  AUTH = '/auth',
  COMMON = '/common',
}

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private router: Router) {
  }

  get core(): string {
    return AppRoutesEnum.CORE;
  }

  get common(): string {
    return AppRoutesEnum.COMMON;
  }

  get appRoutes(): string {
    return '';
  }

  login() {
    this.router.navigateByUrl(`/login`);
  }

  profile() {
    this.router.navigateByUrl(`/profile`);
  }

  dashboardExterno() {
    this.router.navigateByUrl(`/siturin/externo/dashboard`);
  }

  procesoAcreditacion() {
    this.router.navigateByUrl(`/siturin/externo/establecimientos`);
  }

  dashboardTecnicoZonal() {
    this.router.navigateByUrl(`/siturin/interno/tecnico-zonal`);
  }

  dashboardEspecialistaZonal() {
    this.router.navigateByUrl(`/siturin/interno/especialista-zonal`);
  }

  dashboardDAC() {
    this.router.navigateByUrl(`/siturin/interno/catastros-dac`);
  }

  dashboardGAD() {
    this.router.navigateByUrl(`/siturin/interno/catastros-gad`);
  }
}
