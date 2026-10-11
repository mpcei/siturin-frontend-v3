import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { InputText } from 'primeng/inputtext';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Textarea } from 'primeng/textarea';
import { SkeletonComponent } from '../../../../../legacy/shared/components/skeleton/skeleton.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { KeyFilter } from 'primeng/keyfilter';

import { InputNumber } from 'primeng/inputnumber';
import { Select } from 'primeng/select';
import { GoogleMap } from '@angular/google-maps';
import { MapMarker } from '@angular/google-maps';
import { DpaModel, EstablecimientoModel, PersoneriaJuridicaModel } from '@/legacy/models/siturin';
import { CatalogosSiturinHttpService, DinardapHttpService, DpaService, EstablecimientosService, PersoneriaJuridicasHttpService, TramitesHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { CustomValidators } from '@/legacy/shared/validators/custom-validators';
import { CatalogoSiturinTipoEnum } from '@/legacy/shared/enums';
declare var google: any;

@Component({
    selector: 'app-datos-establecimiento',
    templateUrl: './datos-establecimiento.component.html',
    styleUrls: ['./datos-establecimiento.component.scss'],
    imports: [Bind, Divider, ReactiveFormsModule, LabelDirective, ErrorMessageDirective, InputText, NgIf, Textarea, SkeletonComponent, ButtonDirective, Ripple, KeyFilter, NgFor, AsyncPipe, InputNumber, Select, GoogleMap, MapMarker]
})
export class DatosEstablecimientoComponent implements OnInit {
    @Output() faseActualOut: EventEmitter<number> = new EventEmitter<number>();

    private catalogosSiturinHttpService = inject(CatalogosSiturinHttpService);
    private changeDetectorRef = inject(ChangeDetectorRef);
    private coreService = inject(CoreService);
    private dpaService = inject(DpaService);
    private dinardapHttpService = inject(DinardapHttpService);
    private establecimientosService = inject(EstablecimientosService);
    private personeriaJuridicasHttpService = inject(PersoneriaJuridicasHttpService);
    private formBuilder = inject(FormBuilder);
    public messageService = inject(MessageService);
    private tramitesHttpService = inject(TramitesHttpService);
    cargado$ = this.coreService.loaded$;
    personeriaJuridicas: PersoneriaJuridicaModel[] = [];
    formulario: FormGroup = this.nuevoEstablecimientoFormulario;
    formularioPersonaContacto: FormGroup = this.nuevoPersonaContactoFormulario;
    establecimientoSeleccionado: EstablecimientoModel = this.establecimientosService.establecimiento;
    coordenadas: any;
    overlays: any[] = [];
    dpa: DpaModel[] = [];
    provincias: DpaModel[] = [];
    cantones: DpaModel[] = [];
    parroquias: DpaModel[] = [];
    errores: string[] = [];
    cargando: boolean = false;
    esEditableUbicacion: boolean = true;

    constructor() {
        sessionStorage.setItem('esCambioUbicacion', 'false');
        let lat = -0.22985;
        let lng = -78.52495;

        if (this.establecimientoSeleccionado.ubicacion?.longitud && this.establecimientoSeleccionado.ubicacion.latitud) {
            lat = this.establecimientoSeleccionado.ubicacion.latitud;
            lng = this.establecimientoSeleccionado.ubicacion.longitud;
        } else {
            if (this.establecimientoSeleccionado.ubicacion) {
                this.establecimientoSeleccionado.ubicacion.latitud = lat;
                this.establecimientoSeleccionado.ubicacion.longitud = lng;
                this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
            }
        }

        this.coordenadas = {
            center: { lat, lng },
            zoom: 14
        };

        this.iniciarMarcador(lat, lng);

        this.formulario.patchValue(this.establecimientoSeleccionado);

        this.formulario.valueChanges.subscribe(() => (this.establecimientosService.establecimiento = this.establecimientoSeleccionado));

        this.latitudField.setValue(this.coordenadas.center.lat);
        this.longitudField.setValue(this.coordenadas.center.lng);

        this.totalHombresField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.totalHombres = value;

            const totalTrabajadores = value + this.totalMujeresField.value;
            this.totalTrabajadoresField.patchValue(totalTrabajadores);

            this.totalHombresDiscapacidadField.setValidators(Validators.max(this.totalHombresField.value));
            this.totalHombresDiscapacidadField.updateValueAndValidity();
        });

        this.totalMujeresField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.totalMujeres = value;
            const totalTrabajadores = value + this.totalHombresField.value;
            this.totalTrabajadoresField.patchValue(totalTrabajadores);
            this.totalMujeresDiscapacidadField.setValidators(Validators.max(this.totalMujeresField.value));
            this.totalMujeresDiscapacidadField.updateValueAndValidity();
        });

        this.totalHombresDiscapacidadField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.totalHombresDiscapacidad = value;
            // this.totalHombresDiscapacidadField.setValidators(Validators.max(this.totalHombresField.value));
            // this.formulario.updateValueAndValidity();
        });

        this.totalMujeresDiscapacidadField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.tramiteActual) this.establecimientoSeleccionado.tramiteActual.totalMujeresDiscapacidad = value;
            // this.totalMujeresDiscapacidadField.setValidators(Validators.max(this.totalMujeresField.value));
            // this.formulario.updateValueAndValidity();
        });

        this.paginaWebField.valueChanges.subscribe((value) => {
            this.establecimientoSeleccionado.paginaWeb = value;
        });

        this.provinciaField.valueChanges.subscribe((value) => {
            this.establecimientoSeleccionado.provincia = value;
            if (value?.id) this.configurarDpaCantones(value);
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
                this.establecimientoSeleccionado.canton = value;
                this.configurarDpaParroquias(value);
                this.changeDetectorRef.detectChanges();
            }
        });

        this.parroquiaField.valueChanges.subscribe((value) => {
            this.establecimientoSeleccionado.parroquia = value;
        });

        this.callePrincipalField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.ubicacion) this.establecimientoSeleccionado.ubicacion.callePrincipal = value;
        });

        this.calleIntereseccionField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.ubicacion) this.establecimientoSeleccionado.ubicacion.calleInterseccion = value;
        });

        this.calleNumeracionField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.ubicacion) this.establecimientoSeleccionado.ubicacion.calleNumeracion = value;
        });

        this.calleReferenciaField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.ubicacion) this.establecimientoSeleccionado.ubicacion.calleReferencia = value;
        });

        this.latitudField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.ubicacion) this.establecimientoSeleccionado.ubicacion.latitud = value;
        });

        this.longitudField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.ubicacion) this.establecimientoSeleccionado.ubicacion.longitud = value;
        });

        this.personaContactoIdentificacionField.valueChanges.subscribe((value) => {
            if (value.length === 10) {
                this.dinardapHttpService.obtenerRegistroCivil(value).subscribe(
                    (response) => {
                        this.personaContactoNombresField.setValue(response.nombre);
                        if (this.establecimientoSeleccionado.personaContacto) {
                            this.establecimientoSeleccionado.personaContacto.identificacion = value;
                            this.establecimientoSeleccionado.personaContacto.nombres = this.personaContactoNombresField.value;
                        }
                        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
                    },
                    (error) => {
                        this.messageService.getErrorsCustom('Hubo un problema al consultar la cédula', 'Puede ser que la cédula no existe');
                        if (this.establecimientoSeleccionado.personaContacto) {
                            this.establecimientoSeleccionado.personaContacto.identificacion = '';
                            this.establecimientoSeleccionado.personaContacto.nombres = '';
                            this.personaContactoNombresField.setValue(null);
                        }
                        this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
                    }
                );
            } else {
                this.personaContactoNombresField.setValue(null);
            }
            this.formulario.updateValueAndValidity();
        });

        this.personaContactoTelefonoPrincipalField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.personaContacto) {
                this.establecimientoSeleccionado.personaContacto.telefonoPrincipal = value;
            }
        });

        this.personaContactoTelefonoSecundarioField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.personaContacto) {
                this.establecimientoSeleccionado.personaContacto.telefonoSecundario = value;
            }
        });

        this.personaContactoCorreoField.valueChanges.subscribe((value) => {
            if (this.establecimientoSeleccionado.personaContacto) {
                this.establecimientoSeleccionado.personaContacto.correo = value;
            }
        });
    }

    ngOnInit(): void {
        this.obtenerDpa();

        if (this.establecimientoSeleccionado) {
            this.formulario.patchValue(this.establecimientoSeleccionado);
        }

        if (this.provinciaField.valid) {
            this.configurarDpaCantones(this.provinciaField.value);
        }

        if (this.cantonField.valid) {
            this.configurarDpaParroquias(this.cantonField.value);
        }

        if (this.establecimientoSeleccionado.tramiteActual?.tipo?.codigo === 'nueva_actividad') {
            this.esEditableUbicacion = false;
        }
    }

    get nuevoEstablecimientoFormulario(): FormGroup {
        return this.formBuilder.group({
            nombreComercial: [{ value: null, disabled: true }, [Validators.required]],
            paginaWeb: [null, [Validators.pattern(/^[a-z]{2,6}(\.[a-z]{2,6})?.+\.[a-z]{2,4}$/)]],
            numero: [null],
            provincia: [null, [Validators.required]],
            canton: [null, [Validators.required]],
            parroquia: [null, [Validators.required]],
            personaContacto: this.nuevoPersonaContactoFormulario,
            tramiteActual: this.nuevoTramiteFormulario,
            ubicacion: this.nuevoUbicacionFormulario
        });
    }

    get nuevoPersonaContactoFormulario(): FormGroup {
        return this.formBuilder.group({
            identificacion: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            nombres: [{ value: null, disabled: true }, [Validators.required]],
            telefonoPrincipal: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(10)]],
            telefonoSecundario: [null, [Validators.minLength(9), Validators.maxLength(10)]],
            correo: [null, [Validators.required, Validators.email, CustomValidators.personaContactoCorreo]]
        });
    }

    get nuevoUbicacionFormulario(): FormGroup {
        return this.formBuilder.group({
            callePrincipal: [null, [Validators.required]],
            calleNumeracion: [null, [Validators.required]],
            calleInterseccion: [null, [Validators.required]],
            calleReferencia: [null, [Validators.required]],
            latitud: [null, [Validators.required]],
            longitud: [null, [Validators.required]]
        });
    }

    get nuevoTramiteFormulario(): FormGroup {
        return this.formBuilder.group({
            totalHombres: [0, [Validators.min(0)]],
            totalHombresDiscapacidad: [0, [Validators.max(0)]],
            totalMujeres: [0, [Validators.min(0)]],
            totalMujeresDiscapacidad: [0, [Validators.max(0)]],
            totalTrabajadores: [0, [Validators.min(1)]]
        });
    }

    onSubmit() {
        if (this.validarFormulario()) {
            this.guardarTramiteFase2();
        } else {
            this.formulario.markAllAsTouched();
            this.messageService.errorsFields.then();
        }
    }

    guardarTramiteFase2() {
        this.cargando = true;
        this.tramitesHttpService.guardarTramiteFase2(this.establecimientoSeleccionado).subscribe(
            (tramite) => {
                this.cargando = false;
                // this.establecimientosService.establecimiento = this.establecimientoSeleccionado;
                this.faseActualOut.emit(2);
            },
            (error) => (this.cargando = false)
        );
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
        const provincia = this.dpa.find((dpa) => dpa.id == provinciaSeleccionada.id);

        if (provincia?.children) {
            this.cantones = provincia.children.filter((dpa) => dpa.padreId == provinciaSeleccionada.id);
        }
    }

    configurarDpaParroquias(cantonSeleccionado: DpaModel) {
        const canton = this.cantones.find((dpa) => dpa.id == cantonSeleccionado.id);
        if (canton?.children) {
            this.parroquias = canton.children.filter((dpa) => dpa.padreId == cantonSeleccionado.id);
        }
    }

    // agregarMarcador(latitud: number, longitud: number) {
    //   this.overlays.push(new google.maps.Marker({
    //     position: {
    //       lat: latitud,
    //       lng: longitud
    //     }, title: 'Ubicación',
    //     draggable: true
    //   }));
    // }
    actualizarMapa() {
        const parroquia = this.parroquias.find((dpa) => dpa?.codigo === this.parroquiaField.value?.codigo);
        if (parroquia != undefined && parroquia.latitud && parroquia.longitud) {
            this.latitudField.setValue(null);
            this.longitudField.setValue(null);
            this.actualizarMarcador(parroquia.latitud!, parroquia.longitud!);
        }
    }

    iniciarMarcador(lat: number, lng: number) {
        lat = parseFloat(lat.toString());
        lng = parseFloat(lng.toString());
        this.overlays.push(
            new google.maps.Marker({
                position: { lat, lng },
                title: 'Ubicación',
                draggable: true
            })
        );
    }

    actualizarMarcador(lat: number, lng: number) {
        lat = parseFloat(lat.toString());
        lng = parseFloat(lng.toString());

        this.overlays = [];
        this.coordenadas = null;

        setTimeout(() => {
            // map will need some time to load
            this.coordenadas = {
                center: { lat, lng },
                zoom: 14
            };
        }, 300);

        // setTimeout(() => { // map will need some time to load
        //   this.overlays.push(new google.maps.Marker({
        //     position: {lat, lng},
        //     title: 'Ubicación',
        //     draggable: true
        //   }));
        // }, 300);
    }

    agregarMarcador(event: any) {
        if (this.esEditableUbicacion) {
            this.overlays = [];
            this.overlays.push(
                new google.maps.Marker({
                    position: {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng()
                    },
                    title: 'Ubicación',
                    draggable: false
                })
            );

            this.latitudField.patchValue(event.latLng.lat());
            this.longitudField.patchValue(event.latLng.lng());
        }
    }

    cambiarMarcador(event: any) {
        if (this.esEditableUbicacion)
            this.overlays.push(
                new google.maps.Marker({
                    position: {
                        lat: event.latLng.lat(),
                        lng: event.latLng.lng()
                    },
                    title: 'Ubicación',
                    draggable: true
                })
            );
    }

    validarFormulario() {
        this.errores = [];
        if (!this.paginaWebField.valid) {
            this.errores.push('Página Web');
        }
        if (!this.totalHombresField.valid) {
            this.errores.push('Total Hombres');
        }
        if (!this.totalMujeresField.valid) {
            this.errores.push('Total Mujeres');
        }
        if (!this.totalHombresDiscapacidadField.valid) {
            this.errores.push('Total Hombres con Discapacidad');
        }
        if (!this.totalMujeresDiscapacidadField.valid) {
            this.errores.push('Total Mujeres con Discapacidad');
        }
        if (!this.totalTrabajadoresField.valid) {
            this.errores.push('Total Trabajadores');
        }
        if (!this.provinciaField.valid) {
            this.errores.push('Provincia');
        }
        if (!this.cantonField.valid) {
            this.errores.push('Cantón');
        }
        if (!this.parroquiaField.valid) {
            this.errores.push('Parroquia');
        }
        if (!this.callePrincipalField.valid) {
            this.errores.push('Calle Principal');
        }
        if (!this.calleNumeracionField.valid) {
            this.errores.push('Numeración');
        }
        if (!this.calleIntereseccionField.valid) {
            this.errores.push('Calle Intersección');
        }
        if (!this.calleReferenciaField.valid) {
            this.errores.push('Referencia de Ubicación');
        }
        if (!this.longitudField.valid) {
            this.errores.push('Longitud');
        }
        if (!this.latitudField.valid) {
            this.errores.push('Latitud');
        }
        if (!this.personaContactoIdentificacionField.valid) {
            this.errores.push('Cédula de Identidad: ');
        }
        if (!this.personaContactoTelefonoPrincipalField.valid) {
            this.errores.push('Número de Teléfono Principal');
        }
        if (!this.personaContactoTelefonoSecundarioField.valid) {
            this.errores.push('Número de Teléfono Secundario');
        }
        if (!this.personaContactoCorreoField.valid) {
            this.errores.push('Correo Electrónico');
        }
        if (this.parroquiaField.value?.code === '1701') {
            this.errores.push('No puede registrar en Quito');
        }
        this.errores.sort();
        return this.errores.length === 0 && this.formulario.valid;
    }

    actualizarCambioDireccion() {
        sessionStorage.setItem('esCambioUbicacion', 'true');
    }

    get nombreComercialField(): AbstractControl {
        return this.formulario.controls['nombreComercial'];
    }

    get paginaWebField(): AbstractControl {
        return this.formulario.controls['paginaWeb'];
    }

    get tramiteField(): FormGroup {
        return this.formulario.controls['tramiteActual'] as FormGroup;
    }

    get totalHombresField(): AbstractControl {
        return this.tramiteField.controls['totalHombres'];
    }

    get totalHombresDiscapacidadField(): AbstractControl {
        return this.tramiteField.controls['totalHombresDiscapacidad'];
    }

    get totalMujeresField(): AbstractControl {
        return this.tramiteField.controls['totalMujeres'];
    }

    get totalMujeresDiscapacidadField(): AbstractControl {
        return this.tramiteField.controls['totalMujeresDiscapacidad'];
    }

    get totalTrabajadoresField(): AbstractControl {
        return this.tramiteField.controls['totalTrabajadores'];
    }

    get provinciaField(): AbstractControl {
        return this.formulario.controls['provincia'];
    }

    get cantonField(): AbstractControl {
        return this.formulario.controls['canton'];
    }

    get parroquiaField(): AbstractControl {
        return this.formulario.controls['parroquia'];
    }

    get dpaField(): AbstractControl {
        return this.formulario.controls['dpa'];
    }

    get ubicacionField(): FormGroup {
        return this.formulario.controls['ubicacion'] as FormGroup;
    }

    get callePrincipalField(): AbstractControl {
        return this.ubicacionField.controls['callePrincipal'];
    }

    get calleNumeracionField(): AbstractControl {
        return this.ubicacionField.controls['calleNumeracion'];
    }

    get calleIntereseccionField(): AbstractControl {
        return this.ubicacionField.controls['calleInterseccion'];
    }

    get calleReferenciaField(): AbstractControl {
        return this.ubicacionField.controls['calleReferencia'];
    }

    get latitudField(): AbstractControl {
        return this.ubicacionField.controls['latitud'];
    }

    get longitudField(): AbstractControl {
        return this.ubicacionField.controls['longitud'];
    }

    get personaContactoField(): FormGroup {
        return this.formulario.controls['personaContacto'] as FormGroup;
    }

    get personaContactoIdentificacionField(): AbstractControl {
        return this.personaContactoField.controls['identificacion'];
    }

    get personaContactoNombresField(): AbstractControl {
        return this.personaContactoField.controls['nombres'];
    }

    get personaContactoTelefonoPrincipalField(): AbstractControl {
        return this.personaContactoField.controls['telefonoPrincipal'];
    }

    get personaContactoTelefonoSecundarioField(): AbstractControl {
        return this.personaContactoField.controls['telefonoSecundario'];
    }

    get personaContactoCorreoField(): AbstractControl {
        return this.personaContactoField.controls['correo'];
    }
}
