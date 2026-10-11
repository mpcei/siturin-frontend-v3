import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {PermissionModel, RoleModel, UserModel} from '@models/auth';
import {DpaModel, UsuarioExternoModel, UsuarioInternoModel, ZonalModel} from '@models/siturin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private login = new BehaviorSubject<boolean>(this.isLoggedIn);
  public login$ = this.login.asObservable();

  constructor() {
  }

  changeTheme(theme: string) {
    // const themePath = themes.find(element => element.name == theme)?.path;
    //
    // const element = document.getElementById('theme-css');
    // if (element && themePath) {
    //   element.setAttribute('href', themePath);
    // }
  }

  get isLoggedIn(): boolean {
    return Boolean(localStorage.getItem('isLoggedIn'));
  }

  set isLoggedIn(value: boolean) {
    this.login.next(value);
    localStorage.setItem('isLoggedIn', String(value));
  }

  get token(): string | null {
    return localStorage.getItem('accessToken-legacy');
  }

  set token(value: string | undefined | null) {
    localStorage.setItem('accessToken-legacy', JSON.stringify(value));
  }

  get auth(): UserModel {
    return JSON.parse(String(localStorage.getItem('auth-legacy')));
  }

  set auth(user: UserModel | undefined | null) {
    localStorage.setItem('auth-legacy', JSON.stringify(user));
  }

  get usuarioInterno(): UsuarioInternoModel {
    return JSON.parse(String(localStorage.getItem('usuarioInterno')));
  }

  set usuarioInterno(usuarioInterno: UsuarioInternoModel | undefined | null) {
    localStorage.setItem('usuarioInterno', JSON.stringify(usuarioInterno));
  }

  get usuarioExterno(): UsuarioExternoModel {
    return JSON.parse(String(localStorage.getItem('usuarioExterno')));
  }

  set usuarioExterno(usuarioExterno: UsuarioExternoModel | undefined | null) {
    localStorage.setItem('usuarioExterno', JSON.stringify(usuarioExterno));
  }

  get permissions(): PermissionModel[] {
    return JSON.parse(String(localStorage.getItem('permissions')));
  }

  set permissions(permissions: PermissionModel[] | undefined | null) {
    localStorage.setItem('permissions', JSON.stringify(permissions));
  }

  get role(): RoleModel {
    return JSON.parse(String(localStorage.getItem('role-legacy')));
  }

  set role(role: RoleModel | undefined | null) {
    localStorage.setItem('role-legacy', JSON.stringify(role));
  }

  get roles(): RoleModel[] {
    return JSON.parse(String(localStorage.getItem('roles-legacy')));
  }

  set roles(roles: RoleModel[] | undefined | null) {
    localStorage.setItem('roles-legacy', JSON.stringify(roles));
  }

  get zonales(): ZonalModel[] {
    return JSON.parse(String(localStorage.getItem('zonales')));
  }

  set zonales(zonales: ZonalModel[] | undefined | null) {
    localStorage.setItem('zonales', JSON.stringify(zonales));
  }

  get dpa(): DpaModel[] {
    return JSON.parse(String(localStorage.getItem('dpa')));
  }

  set dpa(dpa: DpaModel[] | undefined | null) {
    localStorage.setItem('dpa', JSON.stringify(dpa));
  }

  get keepSession(): boolean | null {
    return JSON.parse(String(localStorage.getItem('keepSession')));
  }

  set keepSession(value: boolean | undefined | null) {
    localStorage.setItem('keepSession', JSON.stringify(value));
  }

  removeLogin() {
    // localStorage.removeItem('usuarioInterno');
    // localStorage.removeItem('usuarioExterno');
    // localStorage.removeItem('role');
    // localStorage.removeItem('auth');
    // localStorage.removeItem('expedienteSuperciesE');
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('isLoggedIn');
    // localStorage.removeItem('roles');
    // localStorage.removeItem('ruc');
    // localStorage.removeItem('zonales');
    // localStorage.removeItem('permissions');
    // localStorage.removeItem('establecimiento');
    localStorage.clear();
    sessionStorage.clear();
    // localStorage.clear();
    this.login.next(false);
  }
}
