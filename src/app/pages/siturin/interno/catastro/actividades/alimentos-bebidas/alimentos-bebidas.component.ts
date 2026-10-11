import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CatalogoModel } from '@models/siturin';
import { CatalogoSiturinTipoEnum, EstablecimientoTipoEnum, ZonaGeograficaCodigoEnum } from '@shared/enums';
import { CatalogosSiturinHttpService, CatalogosSiturinService } from '@services/siturin';
import { environment } from '@env/environment';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { LabelDirective } from '../../../../../../legacy/shared/directives/label.directive';
import { Select } from 'primeng/select';
import { ErrorMessageDirective } from '../../../../../../legacy/shared/directives/error-message.directive';
import { NgIf } from '@angular/common';
import { InputText } from 'primeng/inputtext';
import { Card } from 'primeng/card';
import { MultiSelect } from 'primeng/multiselect';

import { InputNumber } from 'primeng/inputnumber';
@Component({
    selector: 'app-alimentos-bebidas',
    templateUrl: './alimentos-bebidas.component.html',
    styleUrls: ['./alimentos-bebidas.component.scss'],
    imports: [Bind, Panel, ReactiveFormsModule, LabelDirective, Select, ErrorMessageDirective, NgIf, InputText, Card, MultiSelect, InputNumber]
})
export class AlimentosBebidasComponent implements OnInit {
    @Output() alimentosBebidasOut: EventEmitter<any> = new EventEmitter<any>();
    @Input() tramiteAlimentoBebida: AbstractControl = new FormControl();
    @Input() actividad: AbstractControl = new FormControl();
    @Input() clasificacion: AbstractControl = new FormControl();
    @Input() esEditable: boolean = false;

    private formBuilder = inject(FormBuilder);
    private catalogosSiturinHttpService = inject(CatalogosSiturinHttpService);
    private catalogosSiturinService = inject(CatalogosSiturinService);

    formulario: FormGroup = this.nuevoFormulario;
    tiposServicio: CatalogoModel[] = [];
    tiposCocina: CatalogoModel[] = [];
    tipoEstablecimientos: CatalogoModel[] = [];

    constructor() {}

    ngOnInit(): void {
        if (!this.esEditable) {
            this.formulario.disable();
        }

        this.tramiteAlimentoBebidaField.patchValue(this.tramiteAlimentoBebida.value);

        this.obtenerTiposServicio();
        this.obtenerTiposCocina();
        this.obtenerTipoEstablecimientos();

        this.tipoEstablecimientoField.valueChanges.subscribe((value) => {
            this.nombreEstablecimientoField.clearValidators();
            this.tieneCertificadoConcesionFranquiciaField.clearValidators();

            if (value?.codigo === EstablecimientoTipoEnum.CADENA) {
                this.nombreEstablecimientoField.setValidators([Validators.required]);
            }

            if (value?.codigo === EstablecimientoTipoEnum.FRANQUICIA) {
                this.nombreEstablecimientoField.setValidators([Validators.required]);
                this.tieneCertificadoConcesionFranquiciaField.setValidators([Validators.requiredTrue]);
            }

            this.nombreEstablecimientoField.updateValueAndValidity();
            this.tieneCertificadoConcesionFranquiciaField.updateValueAndValidity();
        });

        this.formulario.valueChanges.subscribe((value) => {
            this.alimentosBebidasOut.emit(this.formulario.value);
        });

        this.tipoEstablecimientoField.disable();
    }

    obtenerTiposCocina() {
        const tramiteTiposCocinas = this.actividad.value?.zonaGeografica?.codigo === ZonaGeograficaCodigoEnum.CONTINENTE ? CatalogoSiturinTipoEnum.TRAMITE_TIPOS_COCINAS_CONTINENTE : CatalogoSiturinTipoEnum.TRAMITE_TIPOS_COCINAS_GALAPAGOS;

        this.catalogosSiturinHttpService.obtenerCatalogosPorClasificacion(this.clasificacion.value.id, tramiteTiposCocinas).subscribe((catalogos) => {
            this.tiposCocina = catalogos;
            //revisar
            // if (catalogos.length > 0) {
            //   this.tiposCocinaField.setValidators(Validators.required);
            //   this.tiposCocinaField.updateValueAndValidity();
            // }
        });
    }

    obtenerTiposServicio() {
        const tramiteTiposServicios = this.actividad.value?.zonaGeografica?.codigo === ZonaGeograficaCodigoEnum.CONTINENTE ? CatalogoSiturinTipoEnum.TRAMITE_TIPOS_SERVICIOS_CONTINENTE : CatalogoSiturinTipoEnum.TRAMITE_TIPOS_SERVICIOS_GALAPAGOS;

        this.catalogosSiturinHttpService.obtenerCatalogosPorClasificacion(this.clasificacion.value.id, tramiteTiposServicios).subscribe((catalogos) => {
            this.tiposServicio = catalogos;
            //revisar
            // if (catalogos.length > 0) {
            //   this.tiposServicioField.setValidators(Validators.required);
            //   this.tiposServicioField.updateValueAndValidity();
            // }
        });
    }

    obtenerTipoEstablecimientos() {
        this.tipoEstablecimientos = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TRAMITE_TIPOS_ESTABLECIMIENTOS);
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            tramiteAlimentoBebida: this.nuevoFormularioTramiteAlimentoBebida
        });
    }

    get nuevoFormularioTramiteAlimentoBebida() {
        return this.formBuilder.group({
            tieneCertificadoConcesionFranquicia: [{ value: false, disabled: true }, []],
            tiposCocina: [[]],
            tipoEstablecimiento: [null],
            nombreEstablecimiento: [null],
            tiposServicio: [[]],
            totalCapacidades: [0],
            totalMesas: [0]
        });
    }

    get tiposCocinaField() {
        return this.tramiteAlimentoBebidaField.controls['tiposCocina'];
    }

    get tieneCertificadoConcesionFranquiciaField() {
        return this.tramiteAlimentoBebidaField.controls['tieneCertificadoConcesionFranquicia'];
    }

    get tipoEstablecimientoField() {
        return this.tramiteAlimentoBebidaField.controls['tipoEstablecimiento'];
    }

    get nombreEstablecimientoField() {
        return this.tramiteAlimentoBebidaField.controls['nombreEstablecimiento'];
    }

    get tiposServicioField() {
        return this.tramiteAlimentoBebidaField.controls['tiposServicio'];
    }

    get tramiteAlimentoBebidaField(): FormGroup {
        return this.formulario.controls['tramiteAlimentoBebida'] as FormGroup;
    }

    get totalMesasField() {
        return this.tramiteAlimentoBebidaField.controls['totalMesas'];
    }

    get totalCapacidadesField() {
        return this.tramiteAlimentoBebidaField.controls['totalCapacidades'];
    }

    protected readonly environment = environment;
}
