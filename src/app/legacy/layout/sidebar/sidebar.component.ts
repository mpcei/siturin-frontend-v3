import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {MenuItem, PrimeIcons} from 'primeng/api';
import {AuthHttpService, AuthService, MenusHttpService} from "@services/auth";
import {MenuModel} from "@models/auth";
import {RolesEnum} from '@shared/enums';
import {CoreService, RoutesService} from '@services/core';
import {RucModel} from "@models/siturin";

@Component({
  standalone: false,
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  display = false;
  items: MenuItem[] = [];
  menus: MenuModel[] = [];
  showedMenu: boolean = false;
  closed: boolean = false;
  closedLock: boolean | null = null;
  version: string | null = '';
  logoutDialog: boolean = false;

  constructor(private menusHttpService: MenusHttpService,
              private authHttpService: AuthHttpService,
              private coreService: CoreService,
              public authService: AuthService,
              private router: Router,
              private routesService: RoutesService) {
    this.version = coreService.version;
  }

  ngOnInit(): void {
    this.getMenus();
  }

  showSubMenu(id: number = 0) {
    this.showedMenu = !this.showedMenu;
    if (id > 0) {
      document.getElementById(id?.toString())!.className = this.showedMenu ? 'showMenu' : '';
    }
  }

  getMenus() {
    this.menusHttpService.getMenusForSidebar().subscribe(
      menus => {
        this.menus = menus;
      }
    )
  }

  // lockMenu() {
  //   if (this.closedLock === 'lock') {
  //     this.closedLock = 'lock'
  //   } else {
  //     this.closedLock = 'lock'
  //   }
  //
  // }

  showCloseMenu() {
    if (!this.closedLock) {
      // this.closed = !this.closed;
      this.closed = false;
    }
  }

  closeMenu() {
    if (!this.closedLock) {
      // this.closed = true;
      this.closed = false;
    }
  }

  logout() {
    this.logoutDialog = true;
    this.authHttpService.logout().subscribe(_ => {
      this.logoutDialog = false;
    }, error => this.logoutDialog = false);
  }

  redirectProfile() {
    this.router.navigateByUrl('/administration/users/profile');
  }

  redirectSimulador() {
    this.router.navigateByUrl('/siturin/simulador');
  }

  redirectToDashboard() {
    const role = this.authService.role.name?.toLowerCase();
    switch (role) {
      case RolesEnum.EXTERNO:
        this.routesService.dashboardExterno();
        break;
      case RolesEnum.TECNICO_ZONAL:
        this.routesService.dashboardTecnicoZonal();
        break;
      case RolesEnum.ESPECIALISTA_ZONAL:
        this.routesService.dashboardEspecialistaZonal();
        break;
      case RolesEnum.DAC:
        this.routesService.dashboardDAC();
        break;
      case RolesEnum.GAD:
        this.routesService.dashboardGAD();
        break;
      default:
        this.routesService.dashboardExterno();
    }
  }
}
