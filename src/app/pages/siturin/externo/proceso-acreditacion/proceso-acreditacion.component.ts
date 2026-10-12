import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Steps } from 'primeng/steps';
import { NgIf } from '@angular/common';
import { DatosPersonaComponent } from './datos-persona/datos-persona.component';
import { DatosEstablecimientoComponent } from './datos-establecimiento/datos-establecimiento.component';
import { DatosAcreditacionTuristicaComponent } from './datos-acreditacion-turistica/datos-acreditacion-turistica.component';
import { EstablecimientoModel } from '@/legacy/models/siturin';
import { EstablecimientosService } from '@/legacy/services/siturin';

@Component({
    host: { class: 'siturin-legacy' },
    selector: 'app-proceso-acreditacion',
    templateUrl: './proceso-acreditacion.component.html',
    styleUrls: ['./proceso-acreditacion.component.scss'],
    imports: [Bind, Card, ButtonDirective, Ripple, Steps, NgIf, DatosPersonaComponent, DatosEstablecimientoComponent, DatosAcreditacionTuristicaComponent]
})
export class ProcesoAcreditacionComponent implements OnInit {
    private establecimientosService = inject(EstablecimientosService);
    private router = inject(Router);
    fases: MenuItem[];
    faseActual: number = 0;
    establecimiento: EstablecimientoModel = this.establecimientosService.establecimiento;

    constructor() {
        this.fases = [{ label: 'Datos generales de Persona Natural / Jurídica' }, { label: 'Datos generales del establecimiento' }, { label: 'Acreditación Turística' }];
    }

    ngOnInit(): void {}

    redireccionarEstablecimientos() {
        this.router.navigate(['/siturin/externo/establecimientos']);
    }

    protected readonly environment = environment;
}
