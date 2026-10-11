import {Component, Input, OnInit} from '@angular/core';
import {CatalogoModel, CategoriaModel, ClasificacionModel, PersoneriaJuridicaModel, ZonalModel} from "@models/siturin";
import {environment} from "@env/environment";
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { NgIf } from '@angular/common';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
    selector: 'app-alimentos',
    templateUrl: './alimentos.component.html',
    styleUrls: ['./alimentos.component.scss'],
    imports: [NgIf, Bind, Divider, ReactiveFormsModule, LabelDirective, ToggleSwitch]
})
export class AlimentosComponent implements OnInit {
  @Input() clasificacion!:ClasificacionModel;
  @Input() categoria!:CategoriaModel;
  @Input() personseriaJuridica!:PersoneriaJuridicaModel;
  @Input() zonaGeografica!:CatalogoModel;
  form: UntypedFormGroup = this.newForm;

  constructor(private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
  }

  get newForm(): UntypedFormGroup {
    return this.formBuilder.group({
      tieneRuc: [null, [Validators.required]],
      tieneUsoSuelos: [null, [Validators.required]],
      tieneNombramientoVigente: [null, [Validators.required]],
      tieneActividad: [null, [Validators.required]],
      tieneLocal: [null, [Validators.required]],
      zonaGeografica: [null, [Validators.required]],
      actividad: [null, [Validators.required]],
      clasificacion: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
    });
  }

  protected readonly environment = environment;

  get tieneRucField(): AbstractControl {
    return this.form.controls['tieneRuc'];
  }

  get tieneUsoSuelosField(): AbstractControl {
    return this.form.controls['tieneUsoSuelos'];
  }

  get tieneNombramientoVigenteField(): AbstractControl {
    return this.form.controls['tieneNombramientoVigente'];
  }

  get tieneActividadField(): AbstractControl {
    return this.form.controls['tieneActividad'];
  }

  get tieneLocalField(): AbstractControl {
    return this.form.controls['tieneLocal'];
  }
}
