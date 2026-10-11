import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { NgIf } from '@angular/common';
import { SkeletonComponent } from '../../../../legacy/shared/components/skeleton/skeleton.component';
import { RucModel } from '@/legacy/models/siturin';
import { DinardapHttpService } from '@/legacy/services/siturin';

@Component({
    selector: 'app-datos-sri',
    templateUrl: './datos-sri.component.html',
    styleUrls: ['./datos-sri.component.scss'],
    imports: [NgIf, SkeletonComponent]
})
export class DatosSriComponent implements OnInit {
    @Input() numeroRuc: AbstractControl = new FormControl();
    @Input() ruc: RucModel = {};
    @Input() esCatastrado: boolean = false;
    @Output() rucOutput: EventEmitter<any> = new EventEmitter();
    @Output() cargando: EventEmitter<boolean> = new EventEmitter(false);

    private dinardapHttpService = Inject(DinardapHttpService);
    private formBuilder = Inject(FormBuilder);

    isLoadingSkeleton: string = 'true';
    errorSri: boolean = false;
    formulario: FormGroup = this.nuevoFormulario;

    constructor() {}

    ngOnInit(): void {
        this.formulario.patchValue(this.ruc);

        if (this.esCatastrado) {
            this.isLoadingSkeleton = 'false';
        } else {
            if (this.numeroField.value) {
                this.obtenerDinardapSRI(this.numeroField.value);
            } else {
                this.obtenerDinardapSRI(this.numeroRuc.value);
            }

            this.numeroRuc.valueChanges.pipe(debounceTime(1500)).subscribe((value) => {
                if (value?.length === 13) this.obtenerDinardapSRI(value);
            });
        }
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            estadoContribuyente: [null, [Validators.required]],
            numero: [null, [Validators.required, Validators.minLength(13)]],
            numeroExpedienteSupercias: [null, []],
            razonSocial: [null, [Validators.required]],
            representanteLegalIdentificacion: [null, [Validators.required]],
            representanteLegalNombres: [null, [Validators.required]],
            tipoContribuyente: [null, [Validators.required]],
            actividadEconomicaPrincipal: [null, [Validators.required]]
        });
    }

    obtenerDinardapSRI(ruc: string) {
        this.cargando.emit(true);
        this.isLoadingSkeleton = 'true';
        this.dinardapHttpService.obtenerRuc(ruc).subscribe(
            (ruc:any) => {
                this.cargando.emit(false);
                this.isLoadingSkeleton = 'false';
                this.numeroField.patchValue(ruc.ruc);
                this.razonSocialField.patchValue(ruc.razonSocial);

                this.tipoContribuyenteField.patchValue({
                    codigo: ruc.tipoContribuyente,
                    nombre: ruc.tipoContribuyente
                });

                this.estadoContribuyenteField.patchValue({
                    nombre: ruc.estadoContribuyente
                });

                this.representanteLegalIdentificacionField.patchValue(ruc.cedulaRepresentanteLegal);
                this.representanteLegalNombresField.patchValue(ruc.nombreRepresentanteLegal);
                this.actividadEconomicaField.patchValue(ruc.actividadEconomicaPrincipal);

                this.rucOutput.emit({
                    ruc: ruc.ruc,
                    tipoContribuyente: ruc.tipoContribuyente,
                    razonSocial: ruc.razonSocial,
                    cedulaRepresentanteLegal: ruc.cedulaRepresentanteLegal,
                    nombreRepresentanteLegal: ruc.nombreRepresentanteLegal,
                    actividadEconomicaPrincipal: ruc.actividadEconomicaPrincipal
                });
            },
            (error) => {
                this.formulario.patchValue(this.ruc);
                this.isLoadingSkeleton = 'false';
                this.errorSri = true;
                this.cargando.emit(false);
            }
        );
    }

    get numeroField() {
        return this.formulario.controls['numero'];
    }

    get numeroExpedienteSuperciasField() {
        return this.formulario.controls['numeroExpedienteSupercias'];
    }

    get razonSocialField() {
        return this.formulario.controls['razonSocial'];
    }

    get estadoContribuyenteField() {
        return this.formulario.controls['estadoContribuyente'];
    }

    get tipoContribuyenteField() {
        return this.formulario.controls['tipoContribuyente'];
    }

    get representanteLegalNombresField() {
        return this.formulario.controls['representanteLegalNombres'];
    }

    get representanteLegalIdentificacionField() {
        return this.formulario.controls['representanteLegalIdentificacion'];
    }

    get actividadEconomicaField() {
        return this.formulario.controls['actividadEconomicaPrincipal'];
    }
}
