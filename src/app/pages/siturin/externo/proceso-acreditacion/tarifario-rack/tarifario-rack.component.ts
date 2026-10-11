import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { format, isAfter, isBefore } from 'date-fns';
import { da } from 'date-fns/locale';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { Bind } from 'primeng/bind';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Divider } from 'primeng/divider';
import { Tag } from 'primeng/tag';
import { Panel } from 'primeng/panel';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { SkeletonComponent } from '../../../../../legacy/shared/components/skeleton/skeleton.component';

import { InputNumber } from 'primeng/inputnumber';
import { HabitacionModel, HabitacionTarifaModel, TramiteModel } from '@/legacy/models/siturin';
import { EstablecimientosService, HabitacionesHttpService } from '@/legacy/services/siturin';
import { MessageService } from '@/legacy/services/core';
@Component({
    selector: 'app-tarifario-rack',
    templateUrl: './tarifario-rack.component.html',
    styleUrls: ['./tarifario-rack.component.scss'],
    imports: [NgIf, Bind, ButtonDirective, Ripple, RouterLink, Divider, Tag, NgFor, Panel, ReactiveFormsModule, LabelDirective, ErrorMessageDirective, SkeletonComponent, DatePipe, InputNumber]
})
export class TarifarioRackComponent implements OnInit {
    @Input() tramiteActual: TramiteModel = {};
    @Output() dialogoTarifarioRackOut: EventEmitter<boolean> = new EventEmitter<boolean>(true);

    private formBuilder = inject(FormBuilder);
    private establecimientosService = inject(EstablecimientosService);
    private habitacionesHttpService = inject(HabitacionesHttpService);
    public messageService = inject(MessageService);
    formulario: FormGroup = this.nuevoFormulario;
    cargando: boolean = false;
    tramiteId: number | undefined = this.establecimientosService.establecimiento?.tramiteActual?.id;
    habitacionesVigentes: HabitacionModel[] = [];
    habitacionesInmediatoSiguiente: HabitacionModel[] = [];
    tieneTarifarioRackVigente: boolean = false;
    tieneTarifarioRackInmediatoSiguiente: boolean = false;
    tieneMulta: boolean = false;
    fechaActual: Date = new Date();
    fechaInicioInmediatoSiguienteSinMulta: Date = new Date(`${this.fechaActual.getFullYear()}/07/01 00:00:00`);
    fechaFinInmediatoSiguienteSinMulta: Date = new Date(`${this.fechaActual.getFullYear()}/12/01 23:59:59`);
    fechaInicioInmediatoSiguienteConMulta: Date = new Date(`${this.fechaActual.getFullYear()}/12/02 00:00:00`);
    fechaFinInmediatoSiguienteConMulta: Date = new Date(`${this.fechaActual.getFullYear()}/12/31 23:59:59`);
    fechaInicioConMultaAnterior: Date = new Date(`${this.fechaActual.getFullYear()}/01/01 00:00:00`);
    fechaFinConMultaAnterior: Date = new Date(`${this.fechaActual.getFullYear()}/06/30 23:59:59`);
    disponibleTarifarioRackInmediatoSiguienteSinMulta: boolean = false;
    disponibleTarifarioRackVigenteConMulta: boolean = false;
    disponibleTarifarioRackInmediatoAnterior: boolean = false;
    disponibleTarifarioRackInmediatoSiguienteConMulta: boolean = false;

    constructor() {
        this.habitacionesField.valueChanges.subscribe((value) => {});
    }

    ngOnInit(): void {
        this.cargarTarifarioRack();
    }

    validarFechas(habitacion: HabitacionModel) {
        if (isAfter(this.fechaActual, this.fechaInicioInmediatoSiguienteSinMulta) && isBefore(this.fechaActual, this.fechaFinInmediatoSiguienteSinMulta)) {
            this.disponibleTarifarioRackInmediatoSiguienteSinMulta = true;
        }

        if (isAfter(this.fechaActual, this.fechaInicioInmediatoSiguienteConMulta) && isBefore(this.fechaActual, this.fechaFinInmediatoSiguienteConMulta)) {
            this.disponibleTarifarioRackInmediatoSiguienteConMulta = true;
        }

        if (!habitacion.habitacionTarifa && isAfter(this.fechaActual, this.fechaInicioConMultaAnterior) && isBefore(this.fechaActual, this.fechaFinConMultaAnterior)) {
            this.disponibleTarifarioRackVigenteConMulta = true;
            this.disponibleTarifarioRackInmediatoAnterior = true;
        }
    }

    cargarTarifarioRack() {
        if (this.tramiteId) {
            if (this.tramiteId) {
                this.cargando = true;
                this.habitacionesHttpService.obtenerTarifarioRack(this.tramiteId).subscribe((habitaciones) => {
                    this.cargando = false;
                    this.formulario = this.nuevoFormulario;
                    this.habitacionesVigentes = habitaciones;
                    this.habitacionesInmediatoSiguiente = habitaciones;
                    habitaciones.forEach((habitacion) => {
                        this.validarFechas(habitacion);

                        if (!habitacion.habitacionTarifa && !habitacion.habitacionTarifaSiguiente) {
                            if (this.disponibleTarifarioRackInmediatoSiguienteSinMulta || this.disponibleTarifarioRackInmediatoSiguienteConMulta) {
                                this.agregarHabitacionTarifarioRackSiguienteNuevo(habitacion.id!);
                            }

                            if (this.disponibleTarifarioRackVigenteConMulta) {
                                if (habitacion.habitacionTarifas?.length) {
                                    this.agregarHabitacionTarifarioRackVigenteConMulta(habitacion.id!, habitacion.habitacionTarifas[0]);
                                } else {
                                    this.agregarHabitacionTarifarioRackVigenteNuevo(habitacion.id!);
                                }
                            } else {
                                if (habitacion.habitacionTarifas?.length) {
                                    this.agregarHabitacionTarifarioRackVigente(habitacion.id!, habitacion.habitacionTarifas[0]);
                                } else {
                                    this.agregarHabitacionTarifarioRackVigenteNuevo(habitacion.id!);
                                }
                            }

                            return;
                        }

                        if (habitacion.habitacionTarifa) {
                            this.tieneTarifarioRackVigente = true;
                            this.agregarHabitacionTarifarioRackVigente(habitacion.id!, habitacion.habitacionTarifa);
                        } else {
                            this.tieneTarifarioRackVigente = false;
                            // if (habitacion.habitacionTarifas?.length)
                            // this.agregarHabitacionTarifarioRackVigente(habitacion.id!, habitacion.habitacionTarifas[0]);
                            this.agregarHabitacionTarifarioRackVigenteNuevo(habitacion.id!);
                        }

                        if (habitacion.habitacionTarifaSiguiente) {
                            this.tieneTarifarioRackInmediatoSiguiente = true;
                            this.agregarHabitacionTarifarioRackSiguiente(habitacion.id!, habitacion.habitacionTarifaSiguiente);
                        } else {
                            this.tieneTarifarioRackInmediatoSiguiente = false;
                            this.agregarHabitacionTarifarioRackSiguienteNuevo(habitacion.id!);
                        }
                    });
                });
            }
        }
    }

    agregarHabitacionTarifarioRackVigente(habitacionId: number, data: HabitacionTarifaModel) {
        const habitacionTarifa = this.formBuilder.group({
            id: [data.id, Validators.required],
            habitacionId: [habitacionId, Validators.required],
            habitacionTemporadaAlta: [
                {
                    value: data.habitacionTemporadaAlta,
                    disabled: true
                },
                [Validators.required, Validators.min(1)]
            ],
            habitacionTemporadaBaja: [
                {
                    value: data.habitacionTemporadaBaja,
                    disabled: true
                },
                [Validators.required, Validators.min(1)]
            ],
            personaTemporadaAlta: [
                {
                    value: data.personaTemporadaAlta,
                    disabled: true
                },
                [Validators.required, Validators.min(1)]
            ],
            personaTemporadaBaja: [
                {
                    value: data.personaTemporadaBaja,
                    disabled: true
                },
                [Validators.required, Validators.min(1)]
            ],
            anio: [data.anio, Validators.required],
            fechaDeclaracion: [data.fechaDeclaracion, Validators.required]
        });

        this.habitacionesField.push(habitacionTarifa);
    }

    agregarHabitacionTarifarioRackVigenteConMulta(habitacionId: number, data: HabitacionTarifaModel) {
        let habitacionTarifa = null;
        if (this.disponibleTarifarioRackInmediatoAnterior) {
            habitacionTarifa = this.formBuilder.group({
                id: [data.id, Validators.required],
                habitacionId: [habitacionId, Validators.required],
                habitacionTemporadaAlta: [data.habitacionTemporadaAlta, [Validators.required, Validators.min(1)]],
                habitacionTemporadaBaja: [data.habitacionTemporadaBaja, [Validators.required, Validators.min(1)]],
                personaTemporadaAlta: [data.personaTemporadaAlta, [Validators.required, Validators.min(1)]],
                personaTemporadaBaja: [data.personaTemporadaBaja, [Validators.required, Validators.min(1)]],
                anio: [data.anio, Validators.required],
                fechaDeclaracion: [data.fechaDeclaracion, Validators.required]
            });
        } else {
            habitacionTarifa = this.formBuilder.group({
                id: [data.id, Validators.required],
                habitacionId: [habitacionId, Validators.required],
                habitacionTemporadaAlta: [
                    {
                        value: data.habitacionTemporadaAlta,
                        disabled: true
                    },
                    [Validators.required, Validators.min(1)]
                ],
                habitacionTemporadaBaja: [
                    {
                        value: data.habitacionTemporadaBaja,
                        disabled: true
                    },
                    [Validators.required, Validators.min(1)]
                ],
                personaTemporadaAlta: [
                    {
                        value: data.personaTemporadaAlta,
                        disabled: true
                    },
                    [Validators.required, Validators.min(1)]
                ],
                personaTemporadaBaja: [
                    {
                        value: data.personaTemporadaBaja,
                        disabled: true
                    },
                    [Validators.required, Validators.min(1)]
                ],
                anio: [data.anio, Validators.required],
                fechaDeclaracion: [data.fechaDeclaracion, Validators.required]
            });
        }

        this.habitacionesField.push(habitacionTarifa);
    }

    agregarHabitacionTarifarioRackVigenteNuevo(habitacionId: number) {
        const habitacionTarifa = this.formBuilder.group({
            id: [null],
            habitacionId: [habitacionId, Validators.required],
            habitacionTemporadaAlta: [0, [Validators.required, Validators.min(1)]],
            habitacionTemporadaBaja: [0, [Validators.required, Validators.min(1)]],
            personaTemporadaAlta: [0, [Validators.required, Validators.min(1)]],
            personaTemporadaBaja: [0, [Validators.required, Validators.min(1)]],
            anio: [new Date().getFullYear(), Validators.required],
            fechaDeclaracion: [new Date(), Validators.required]
        });

        this.habitacionesField.push(habitacionTarifa);
    }

    agregarHabitacionTarifarioRackSiguiente(habitacionId: number, data: any) {
        const habitacionTarifa = this.formBuilder.group({
            id: [data.id, Validators.required],
            habitacionId: [habitacionId, Validators.required],
            habitacionTemporadaAlta: [
                {
                    value: data.habitacionTemporadaAlta,
                    disabled: true
                },
                [Validators.required, Validators.min(1)]
            ],
            habitacionTemporadaBaja: [
                {
                    value: data.habitacionTemporadaBaja,
                    disabled: true
                },
                [Validators.required, Validators.min(1)]
            ],
            personaTemporadaAlta: [
                {
                    value: data.personaTemporadaAlta,
                    disabled: true
                },
                [Validators.required, Validators.min(1)]
            ],
            personaTemporadaBaja: [
                {
                    value: data.personaTemporadaBaja,
                    disabled: true
                },
                [Validators.required, Validators.min(1)]
            ],
            anio: [data.anio, Validators.required],
            fechaDeclaracion: [data.fechaDeclaracion, Validators.required]
        });

        this.habitacionesTarifarioRackSiguienteField.push(habitacionTarifa);
    }

    agregarHabitacionTarifarioRackSiguienteNuevo(habitacionId: number) {
        const habitacionTarifa = this.formBuilder.group({
            id: [null],
            habitacionId: [habitacionId, Validators.required],
            habitacionTemporadaAlta: [0, [Validators.required, Validators.min(1)]],
            habitacionTemporadaBaja: [0, [Validators.required, Validators.min(1)]],
            personaTemporadaAlta: [0, [Validators.required, Validators.min(1)]],
            personaTemporadaBaja: [0, [Validators.required, Validators.min(1)]],
            anio: [new Date().getFullYear() + 1, Validators.required],
            fechaDeclaracion: [new Date(), Validators.required]
        });

        this.habitacionesTarifarioRackSiguienteField.push(habitacionTarifa);
    }

    guardarTarifarioRackVigente() {
        if (!this.habitacionesField.valid) {
            this.messageService.getErrorsCustom('Errores en la declaración', 'No puede declarar valores en 0');
            this.habitacionesField.markAllAsTouched();
            return;
        }

        this.messageService.questionCustom(`¿Está seguro de declarar Tarifario Rack año en curso?`, `Recuerde que no podrá realizar cambios`, 'Si, Declarar').then((result) => {
            if (result.isConfirmed) {
                this.cargando = true;
                this.habitacionesHttpService.actualizarTarifarioRack(this.tramiteId!, this.habitacionesField.value).subscribe(
                    (_) => {
                        this.dialogoTarifarioRackOut.emit(false);
                        this.cargando = false;
                        this.inicializarBanderas();
                        this.cargarTarifarioRack();
                    },
                    (error) => (this.cargando = false)
                );
            }
        });
    }

    guardarTarifarioRackInmediatoSiguiente() {
        if (!this.tieneTarifarioRackVigente) {
            this.messageService.getErrorsCustom('No se pudo enviar la declaración', 'Para poder declarar el Tarifario Rack del año inmediato siguiente por favor declare del año en curso.');
            return;
        }

        if (!this.habitacionesTarifarioRackSiguienteField.valid) {
            this.messageService.getErrorsCustom('Errores en la declaración', 'No puede declarar valores en 0');
            this.habitacionesTarifarioRackSiguienteField.markAllAsTouched();
            return;
        }

        this.messageService.questionCustom(`¿Está seguro de declarar Tarifario Rack año inmediato siguiente?`, `Recuerde que no podrá realizar cambios`, 'Si, Declarar').then((result) => {
            if (result.isConfirmed) {
                this.cargando = true;
                this.habitacionesHttpService.actualizarTarifarioRackInmediatoSiguiente(this.habitacionesTarifarioRackSiguienteField.value).subscribe(
                    (_) => {
                        this.dialogoTarifarioRackOut.emit(false);
                        this.cargando = false;
                        this.inicializarBanderas();
                        this.cargarTarifarioRack();
                    },
                    (error) => (this.cargando = false)
                );
            }
        });
    }

    inicializarBanderas() {
        this.disponibleTarifarioRackInmediatoSiguienteSinMulta = false;
        this.disponibleTarifarioRackVigenteConMulta = false;
        this.disponibleTarifarioRackInmediatoAnterior = false;
        this.disponibleTarifarioRackInmediatoSiguienteConMulta = false;
    }

    get nuevoFormulario() {
        return this.formBuilder.group({
            habitaciones: this.formBuilder.array([]),
            habitacionesTarifarioRackSiguiente: this.formBuilder.array([])
        });
    }

    get nuevoFormularioHabitacionTarifa() {
        return this.formBuilder.group({
            habitacionTemporadaAlta: [null, [Validators.required]],
            habitacionTemporadaBaja: [null, [Validators.required]],
            personaTemporadaAlta: [null, [Validators.required]],
            personaTemporadaBaja: [null, [Validators.required]]
        });
    }

    get habitacionesField() {
        return this.formulario.controls['habitaciones'] as FormArray;
    }

    get habitacionesTarifarioRackSiguienteField() {
        return this.formulario.controls['habitacionesTarifarioRackSiguiente'] as FormArray;
    }
}
