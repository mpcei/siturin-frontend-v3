import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DatosSriComponent } from '../../../compartido/datos-sri/datos-sri.component';
import { NgIf, NgFor } from '@angular/common';
import { DatosSuperciasComponent } from '../../../compartido/datos-supercias/datos-supercias.component';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { SkeletonComponent } from '../../../../../legacy/shared/components/skeleton/skeleton.component';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

import { Select } from 'primeng/select';
import { EstablecimientoModel, PersoneriaJuridicaModel, RucModel } from '@/legacy/models/siturin';
import { CatalogosSiturinHttpService, DinardapHttpService, EstablecimientosHttpService, EstablecimientosService, PersoneriaJuridicasHttpService, TramitesHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { RucTipoContribuyenteEnum } from '@/legacy/shared/enums';
@Component({
    selector: 'app-datos-persona',
    templateUrl: './datos-persona.component.html',
    styleUrls: ['./datos-persona.component.scss'],
    imports: [DatosSriComponent, NgIf, DatosSuperciasComponent, Bind, Divider, SkeletonComponent, ReactiveFormsModule, LabelDirective, ErrorMessageDirective, ToggleSwitch, NgFor, ButtonDirective, Ripple, Select]
})
export class DatosPersonaComponent implements OnInit {
    @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();

    private catalogosSiturinHttpService = inject(CatalogosSiturinHttpService);
    private coreService = inject(CoreService);
    private dinardapHttpService = inject(DinardapHttpService);
    private establecimientosService = inject(EstablecimientosService);
    private establecimientosHttpService = inject(EstablecimientosHttpService);
    private formBuilder = inject(FormBuilder);
    private personeriaJuridicasHttpService = inject(PersoneriaJuridicasHttpService);
    public messageService = inject(MessageService);
    private tramitesHttpService = inject(TramitesHttpService);

    cargado$ = this.coreService.loaded$;
    personeriaJuridicas: PersoneriaJuridicaModel[] = [];
    formulario1: FormGroup = this.nuevoFormulario1;
    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
    cargando: boolean = false;
    esCatastrado: boolean = false;
    errores: string[] = [];
    ruc: RucModel = {};

    constructor() {
        // if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo !== TramiteTiposEnum.REGISTRO) {
        //   this.esCatastrado = true;
        // }

        this.numeroExpedienteSuperciasField.patchValue(this.establecimientoSeleccionado.ruc?.numeroExpedienteSupercias);

        if (this.establecimientoSeleccionado.tramiteActual) {
            this.personeriaJuridicaField.patchValue(this.establecimientoSeleccionado.tramiteActual.personeriaJuridica);
            this.tieneDocumentoActividadTuristicaField.patchValue(this.establecimientoSeleccionado.tramiteActual.tieneDocumentoActividadTuristica);
            this.tieneNombramientoVigenteField.patchValue(this.establecimientoSeleccionado.tramiteActual.tieneNombramientoVigente);
        }

        this.personeriaJuridicaField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.personeriaJuridica = value;
        });

        this.tieneDocumentoActividadTuristicaField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.tieneDocumentoActividadTuristica = value;
        });

        this.tieneNombramientoVigenteField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.tieneNombramientoVigente = value;
        });

        this.formulario1.valueChanges.subscribe(() => {
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        });
    }

    ngOnInit(): void {
        this.obtenerPersoneriaJuridicas();
        if (this.establecimientoSeleccionado.ruc?.tipoContribuyente?.codigo === RucTipoContribuyenteEnum.JURIDICA) {
            this.personeriaJuridicaField.setValidators(Validators.required);
            this.tieneNombramientoVigenteField.setValidators(Validators.requiredTrue);
            this.tieneDocumentoActividadTuristicaField.setValidators(Validators.requiredTrue);
        } else {
            this.personeriaJuridicaField.setValidators(null);
            this.tieneNombramientoVigenteField.setValidators(null);
            this.tieneDocumentoActividadTuristicaField.setValidators(null);
            this.formulario1.updateValueAndValidity();
        }
        this.personeriaJuridicaField.updateValueAndValidity();
        this.tieneNombramientoVigenteField.updateValueAndValidity();
        this.tieneDocumentoActividadTuristicaField.updateValueAndValidity();
    }

    get nuevoFormulario1(): FormGroup {
        return this.formBuilder.group({
            personeriaJuridica: [null, [Validators.required]],
            tieneDocumentoActividadTuristica: [null, [Validators.requiredTrue]],
            tieneNombramientoVigente: [null, [Validators.requiredTrue]],
            tieneRUC: [null],
            numeroExpedienteSupercias: [null, []]
        });
    }

    onSubmit() {
        if (this.validarFormulario()) {
            this.guardarTramiteFase1();
        } else {
            this.formulario1.markAllAsTouched();
            this.messageService.errorsFields.then();
        }
    }

    obtenerPersoneriaJuridicas() {
        this.personeriaJuridicasHttpService.obtenerPersoneriaJuridicas().subscribe((personeriaJuridicas) => {
            this.personeriaJuridicas = personeriaJuridicas;
        });
    }

    guardarTramiteFase1() {
        this.cargando = true;
        this.tramitesHttpService.guardarTramiteFase1(this.establecimientoSeleccionado).subscribe(
            (tramite) => {
                this.cargando = false;
                if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.id = tramite.id;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
                this.faseActualOut.emit(1);
            },
            (error) => {
                this.cargando = false;
            }
        );
    }

    cargarNumeroExpedienteSupercias(event: string) {
        this.numeroExpedienteSuperciasField.patchValue(event);
        if (this.establecimientoSeleccionado.ruc) {
            this.establecimientoSeleccionado.ruc.numeroExpedienteSupercias = event;
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }
    }

    validarFormulario() {
        this.errores = [];
        if (!this.tieneNombramientoVigenteField.valid) {
            this.errores.push('No ha seleccionado el requisito referente al "Nombramiento vigente del o los representantes legales, debidamente inscrito ante la autoridad correspondiente"');
        }
        if (!this.tieneDocumentoActividadTuristicaField.valid) {
            this.errores.push('No ha seleccionado el requisito referente al “Documento constitutivo de la misma debidamente aprobada por la autoridad correspondiente, en la que conste como su objeto social el desarrollo de la actividad turística;"');
        }
        if (!this.personeriaJuridicaField.valid) {
            this.errores.push('Personería Jurídica');
        }
        this.errores.sort();
        return this.errores.length === 0 && this.formulario1.valid;
    }

    saveRuc(event: any) {
        this.ruc = event;

        if (this.establecimientoSeleccionado.ruc) {
            this.establecimientoSeleccionado.ruc.representanteLegalIdentificacion = event.cedulaRepresentanteLegal;
            this.establecimientoSeleccionado.ruc.representanteLegalNombres = event.nombreRepresentanteLegal;
            this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
        }
    }

    get personeriaJuridicaField(): AbstractControl {
        return this.formulario1.controls['personeriaJuridica'];
    }

    get tieneDocumentoActividadTuristicaField(): AbstractControl {
        return this.formulario1.controls['tieneDocumentoActividadTuristica'];
    }

    get tieneNombramientoVigenteField(): AbstractControl {
        return this.formulario1.controls['tieneNombramientoVigente'];
    }

    get numeroExpedienteSuperciasField(): AbstractControl {
        return this.formulario1.controls['numeroExpedienteSupercias'];
    }

    get tieneRUCField(): AbstractControl {
        return this.formulario1.controls['tieneRUC'];
    }
}
