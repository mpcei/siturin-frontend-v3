import { Component, inject, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Dialog } from 'primeng/dialog';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ButtonDirective } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Ripple } from 'primeng/ripple';
import { UsuarioExternosHttpService } from '@/legacy/services/siturin';
import { AuthHttpService, AuthService } from '@/legacy/services/auth';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    imports: [Bind, Dialog, PdfViewerModule, ButtonDirective, Checkbox, ReactiveFormsModule, FormsModule, Ripple]
})
export class DashboardComponent implements OnInit {
    private usuarioExternosHttpService = inject(UsuarioExternosHttpService);
    private authHttpService = inject(AuthHttpService);
    private authService = inject(AuthService);

    dialogoTerminosCondiciones: boolean = true;
    aceptaTerminosCondiciones: boolean = false;
    STORAGE_URL = environment.STORAGE_URL;
    pdfSrc = '';

    constructor() {
        this.pdfSrc = '/assets/archivos/terminos_condiciones.pdf';
    }

    ngOnInit(): void {
        this.dialogoTerminosCondiciones = !this.authService.usuarioExterno.terminosCondiciones!;
    }

    aceptarTerminosCondiciones() {
        this.usuarioExternosHttpService.aceptarTerminosCondiciones(this.authService.usuarioExterno.id!).subscribe((_) => {
            this.authService.usuarioExterno.terminosCondiciones = true;
            this.dialogoTerminosCondiciones = false;
        });
    }

    cancelarTerminosCondiciones() {
        this.dialogoTerminosCondiciones = false;
        this.authHttpService.logout().subscribe();
    }

    descargarTerminosCondiciones() {
        window.open(this.STORAGE_URL + '/archivos/terminos_condiciones.pdf');
    }

    protected readonly environment = environment;
}
