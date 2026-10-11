import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormControl, Validator, Validators, ReactiveFormsModule } from '@angular/forms';
import {CatastrosHttpService} from '@services/siturin';
import {CatastroModel} from '@models/siturin';
import {MessageService} from '@services/core';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { NgIf, NgFor } from '@angular/common';
import { SkeletonComponent } from '../../../legacy/shared/components/skeleton/skeleton.component';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'app-validador-documento',
    templateUrl: './validador-documento.component.html',
    styleUrls: ['./validador-documento.component.scss'],
    imports: [Bind, Card, ButtonDirective, Ripple, ReactiveFormsModule, InputText, NgIf, SkeletonComponent, Divider, NgFor]
})
export class ValidadorDocumentoComponent implements OnInit {
  numeroRegistroControl: FormControl = new FormControl<string>('', [Validators.required]);
  catastro: CatastroModel = {};
  cargando: boolean = false;
  totalHabitaciones: number = 0;
  totalCamas: number = 0;
  totalPlazas: number = 0;
  totalCapacidades: number = 0;
  tituloClass: string = 'field xl:col-6 lg:col-6 md:col-6 sm:col-6 text-right titulo'
  textoClass: string = 'field xl:col-6 lg:col-6 md:col-6 sm:col-6 text-left texto'

  constructor(private activatedRoute: ActivatedRoute,
              private catastrosHttpService: CatastrosHttpService,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['q']) {
        this.numeroRegistroControl.setValue(params['q']);
        this.obtenerDatos(params['q']);
      }
    });
  }

  obtenerDatos(numeroRegistro: string) {
    this.catastro = {};
    this.totalHabitaciones = 0;
    this.totalCamas = 0;
    this.totalPlazas = 0;
    this.totalCapacidades = 0;
    this.cargando = true;
    numeroRegistro = numeroRegistro?.trim();
    if (numeroRegistro.length > 0) {
      this.catastrosHttpService.obtenerCatastroValidadorDocumento(numeroRegistro).subscribe(catastro => {
        this.catastro = catastro;
        this.cargando = false;
        this.catastro.tramite?.habitaciones?.forEach(habitacion => {
          this.totalHabitaciones += habitacion?.habitaciones!;
          this.totalCamas += habitacion?.camas!;
          this.totalPlazas += habitacion?.plazas!;
        });

        this.catastro.tramite?.transporteTerrestres?.forEach(transporte => {
          this.totalCapacidades += transporte?.capacidad!;
        });
      }, error => this.cargando = false);
    } else {
      this.messageService.getErrorsCustom('Debe ingresar un número válido', 'Intente de nuevo por favor');
      this.cargando = false;
    }
  }
}
