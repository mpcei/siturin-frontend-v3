import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CatalogoModel, DpaModel, PersoneriaJuridicaModel, TramiteModel } from '@models/siturin';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CatalogosSiturinHttpService, CatalogosSiturinService, DpaService, PersoneriaJuridicasHttpService, TramitesHttpService } from '@services/siturin';
import { MessageService } from '@services/core';
import { CatalogoSiturinTipoEnum } from '@shared/enums';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { Bind } from 'primeng/bind';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { Select } from 'primeng/select';
import { Divider } from 'primeng/divider';
import { NgFor } from '@angular/common';
import { Checkbox } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-inactivacion-interno',
    templateUrl: './inactivacion-interno.component.html',
    styleUrls: ['./inactivacion-interno.component.scss'],
    imports: [ReactiveFormsModule, LabelDirective, Bind, ToggleSwitch, ErrorMessageDirective, Select, Divider, NgFor, Checkbox, ButtonDirective, Ripple]
})
export class InactivacionInternoComponent implements OnInit {
    @Output() dialogoOutput: EventEmitter<boolean> = new EventEmitter<boolean>(true);
    @Output() tramiteInactivacionOut: EventEmitter<any> = new EventEmitter<any>();
    @Input() tramiteActual: TramiteModel = {};

    private dpaService = inject(DpaService);
    private formBuilder = inject(FormBuilder);
    private catalogosSiturinService = inject(CatalogosSiturinService);
    public messageService = inject(MessageService);
    private personeriaJuridicasHttpService = inject(PersoneriaJuridicasHttpService);
    private tramitesHttpService = inject(TramitesHttpService);
    formulario: FormGroup = this.nuevoFormulario;
    causalesInactivacion: CatalogoModel[] = [];
    dpa: DpaModel[] = [];
    provincias: DpaModel[] = [];
    cantones: DpaModel[] = [];
    parroquias: DpaModel[] = [];
    personeriaJuridicas: PersoneriaJuridicaModel[] = [];
    tiposCausaInactivacion: CatalogoModel[] = [];

    constructor() {}

    ngOnInit(): void {
        this.obtenerCausalesInactivacion();
        this.obtenerDpa();
        this.obtenerPersoneriaJuridicas();
        this.obtenerTiposCausaInactivacion();

        this.provinciaField.valueChanges.subscribe((value) => {
            this.configurarDpaCantones(value);
        });

        this.cantonField.valueChanges.subscribe((value) => {
            if (value && value.codigo == '1701') {
                this.messageService.getErrorsCustom(
                    'No se puede registrar en Quito',
                    'Estimado Usuario, para solicitar el Certificado de Registro de Turismo de establecimientos ubicados en el Cantón Quito, por favor acérquese a la Empresa Pública Metropolitana de Gestión de Destino Turístico - Quito Turismo'
                );
                this.parroquias = [];
                this.parroquiaField.setValue(null);
                return;
            }
            if (value) {
                this.configurarDpaParroquias(value);
            }
        });
    }

    get nuevoFormulario(): FormGroup {
        return this.formBuilder.group({
            causalesInactivacion: [[], Validators.required],
            provincia: [null],
            canton: [null],
            parroquia: [null],
            personeriaJuridica: [null],
            tieneDeuda: [false, Validators.required],
            tipoCausaInactivacion: [null, Validators.required],
            tramiteActual: [null]
        });
    }

    obtenerCausalesInactivacion() {
        this.causalesInactivacion = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.CAUSALES_INACTIVACION_INTERNO);
    }

    obtenerTiposCausaInactivacion() {
        this.tiposCausaInactivacion = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.TIPOS_CAUSAS_INACTIVACION);
        this.tiposCausaInactivacion = this.tiposCausaInactivacion.filter((item) => item.codigo === 'de_oficio');
    }

    obtenerPersoneriaJuridicas() {
        this.personeriaJuridicasHttpService.obtenerPersoneriaJuridicas().subscribe((personeriaJuridicas) => {
            this.personeriaJuridicas = personeriaJuridicas;
        });
    }

    obtenerDpa() {
        this.dpa = this.dpaService.dpa;
        this.configurarDpaProvincias();
    }

    configurarDpaProvincias() {
        this.provincias = this.dpa.filter((dpa) => dpa.tipo?.codigo === CatalogoSiturinTipoEnum.PROVINCIA);
    }

    configurarDpaCantones(provinciaSeleccionada: DpaModel) {
        if (provinciaSeleccionada?.children) this.cantones = provinciaSeleccionada.children;
    }

    configurarDpaParroquias(cantonSeleccionado: DpaModel) {
        if (cantonSeleccionado?.children) this.parroquias = cantonSeleccionado.children;
    }

    onSubmit() {
        if (this.formulario.valid) {
            this.crearTramite();
        } else {
            this.formulario.markAllAsTouched();
        }
    }

    crearTramite() {
        if (this.tramiteActual?.id) {
            // this.tramiteActualField.patchValue(this.tramiteActual);
            const tramiteInactivacion = {
                causalesInactivacion: this.causalesInactivacionField.value,
                // provincia: {id: this.provinciaField.value.id},
                // canton: {id: this.cantonField.value.id},
                // parroquia: {id: this.parroquiaField.value.id},
                // personeriaJuridica: this.personeriaJuridicaField.value,
                tieneDeuda: this.tieneDeudaField.value,
                tipoCausaInactivacion: this.tipoCausaInactivacionField.value
            };
            this.tramiteInactivacionOut.emit(tramiteInactivacion);
            this.dialogoOutput.emit(false);
            // this.tramitesHttpService.guardarTramiteInactivacion(this.tramiteActual.id, this.formulario.value).subscribe(response => {
            //   this.formulario.reset();
            //   this.dialogoOutput.emit(false);
            // });
        }
    }

    get causalesInactivacionField(): FormControl {
        return this.formulario.controls['causalesInactivacion'] as FormControl;
    }

    get tramiteActualField() {
        return this.formulario.controls['tramiteActual'];
    }

    get provinciaField() {
        return this.formulario.controls['provincia'];
    }

    get cantonField() {
        return this.formulario.controls['canton'];
    }

    get parroquiaField() {
        return this.formulario.controls['parroquia'];
    }

    get personeriaJuridicaField() {
        return this.formulario.controls['personeriaJuridica'];
    }

    get tieneDeudaField() {
        return this.formulario.controls['tieneDeuda'];
    }

    get tipoCausaInactivacionField() {
        return this.formulario.controls['tipoCausaInactivacion'];
    }
}
