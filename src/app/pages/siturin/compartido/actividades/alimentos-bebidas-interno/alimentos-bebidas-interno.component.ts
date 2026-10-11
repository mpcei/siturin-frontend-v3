import { Component, inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { NgIf, NgFor } from '@angular/common';
import { Card } from 'primeng/card';
import { CatalogosSiturinHttpService } from '@/legacy/services/siturin';
import { TramiteAlimentoBebidaModel } from '@/legacy/models/siturin';

@Component({
    selector: 'app-alimentos-bebidas-interno',
    templateUrl: './alimentos-bebidas-interno.component.html',
    styleUrls: ['./alimentos-bebidas-interno.component.scss'],
    imports: [Bind, Panel, ReactiveFormsModule, LabelDirective, NgIf, Card, NgFor]
})
export class AlimentosBebidasInternoComponent implements OnInit {
    @Input() tramiteAlimentoBebida: TramiteAlimentoBebidaModel = {};
    @Input() actividad: AbstractControl = new FormControl();
    @Input() clasificacion: AbstractControl = new FormControl();
    private catalogosSiturinHttpService = inject(CatalogosSiturinHttpService);
    constructor() {}

    ngOnInit(): void {}
}
