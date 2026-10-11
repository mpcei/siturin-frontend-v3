import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '@env/environment';
import { NgZone } from '@angular/core';
import { LabelDirective } from '../../../../../legacy/shared/directives/label.directive';
import { ErrorMessageDirective } from '../../../../../legacy/shared/directives/error-message.directive';
import { NgIf, NgFor } from '@angular/common';
import { Bind } from 'primeng/bind';
import { Divider } from 'primeng/divider';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { Checkbox } from 'primeng/checkbox';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

import { Select } from 'primeng/select';
import { GoogleMap } from '@angular/google-maps';
import { MapMarker } from '@angular/google-maps';
import { CatalogoModel, DpaModel, EstablecimientoModel, PersoneriaJuridicaModel, TramiteModel } from '@/legacy/models/siturin';
import { CatalogosSiturinService, CatastrosHttpService, DpaService, PersoneriaJuridicasHttpService, TramitesHttpService } from '@/legacy/services/siturin';
import { CoreService, MessageService } from '@/legacy/services/core';
import { CatalogoSiturinTipoEnum } from '@/legacy/shared/enums';
declare var google: any;

@Component({
    selector: 'app-inactivacion',
    templateUrl: './inactivacion.component.html',
    styleUrls: ['./inactivacion.component.scss'],
    imports: [ReactiveFormsModule, LabelDirective, ErrorMessageDirective, NgIf, Bind, Divider, InputText, Textarea, NgFor, Checkbox, ButtonDirective, Ripple, Select, GoogleMap, MapMarker]
})
export class InactivacionComponent implements OnInit {
    @Output() dialogoOutput: EventEmitter<boolean> = new EventEmitter<boolean>(true);
    @Output() cargandoOutput: EventEmitter<boolean> = new EventEmitter<boolean>(false);
    @Input() establecimiento: EstablecimientoModel = {};
    @Input() tramiteActual: TramiteModel = {};
    @Input() esExterno: boolean = true;

    private ngZone = inject(NgZone);
    private catastrosHttpService = inject(CatastrosHttpService);
    private coreService = inject(CoreService);
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
    coordenadas: any;
    overlays: any[] = [];

    cargando: boolean = false;

    constructor() {}

    ngOnInit(): void {
        this.obtenerCausalesInactivacion();
        this.obtenerDpa();
        this.obtenerPersoneriaJuridicas();

        this.provinciaField.setValue(this.establecimiento.provincia);
        this.configurarDpaCantones(this.provinciaField.value);
        this.cantonField.setValue(this.establecimiento.canton);
        this.configurarDpaParroquias(this.cantonField.value);
        this.parroquiaField.setValue(this.establecimiento.parroquia);

        this.callePrincipalField.setValue(this.establecimiento.ubicacion?.callePrincipal);
        this.calleIntereseccionField.setValue(this.establecimiento.ubicacion?.calleInterseccion);
        this.calleNumeracionField.setValue(this.establecimiento.ubicacion?.calleNumeracion);
        this.calleReferenciaField.setValue(this.establecimiento.ubicacion?.calleReferencia);
        this.latitudField.setValue(this.establecimiento.ubicacion?.latitud);
        this.longitudField.setValue(this.establecimiento.ubicacion?.longitud);

        let lat = -0.22985;
        let lng = -78.52495;
        if (this.latitudField.value && this.longitudField.value) {
            lat = this.latitudField.value;
            lng = this.longitudField.value;
        }

        this.coordenadas = {
            center: { lat, lng },
            zoom: 14
        };
        this.iniciarMarcador(lat, lng);
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
            provincia: [null, Validators.required],
            canton: [null, Validators.required],
            parroquia: [null, Validators.required],
            tramiteActual: [null],
            ubicacion: this.nuevoUbicacionFormulario
        });
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

    agregarMarcador(event: any) {
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

    actualizarMapa() {
        const parroquia = this.parroquias.find((dpa) => dpa?.codigo === this.parroquiaField.value?.codigo);
        if (parroquia != undefined && parroquia.latitud && parroquia.longitud) {
            this.latitudField.setValue(null);
            this.longitudField.setValue(null);
            this.actualizarMarcador(parroquia.latitud!, parroquia.longitud!);
        }
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

    cambiarMarcador(event: any) {
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

    obtenerCausalesInactivacion() {
        if (this.esExterno) this.causalesInactivacion = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.CAUSALES_INACTIVACION);
        else this.causalesInactivacion = this.catalogosSiturinService.obtenerCatalogosPorTipo(CatalogoSiturinTipoEnum.CAUSALES_INACTIVACION_INTERNO);
        this.causalesInactivacion = this.causalesInactivacion.sort(function (a, b) {
            if (a.codigo! > b.codigo!) {
                return 1;
            }
            if (a.codigo! < b.codigo!) {
                return -1;
            }
            // a must be equal to b
            return 0;
        });
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
        const provincia = this.dpa.find((dpa) => dpa.id === provinciaSeleccionada?.id);

        if (provincia?.children) {
            this.cantones = provincia.children.filter((dpa) => dpa.padreId == provinciaSeleccionada.id);
        }
    }

    configurarDpaParroquias(cantonSeleccionado: DpaModel) {
        const canton = this.cantones.find((dpa) => dpa.id === cantonSeleccionado.id);

        if (canton?.children) {
            this.parroquias = canton.children.filter((dpa) => dpa.padreId == cantonSeleccionado.id);
        }
    }

    onSubmit() {
        if (this.formulario.valid) {
            this.crearTramite();
        } else {
            this.formulario.markAllAsTouched();
        }
    }

    crearTramite() {
        this.dialogoOutput.emit(true);
        this.cargandoOutput.emit(true);
        this.messageService
            .questionCustom(
                `¿Está seguro de gestionar el trámite de Inactivación ante el ${environment.MINISTERIO}?`,
                'Recuerde que, una vez enviada la solicitud, no podrá realizar ningún trámite de acreditación correspondiente al registro de turismo inactivado <b>durante el plazo de seis meses </b> contados desde su inactivación.'
            )
            .then((result) => {
                if (result.isConfirmed) {
                    this.ngZone.run(() => {
                        let tramiteActualId = 0;

                        if (this.establecimiento.tramiteActual?.id) {
                            tramiteActualId = this.establecimiento.tramiteActual?.id;
                            this.tramiteActualField.patchValue(this.establecimiento.tramiteActual);
                        } else if (this.tramiteActual?.id) {
                            tramiteActualId = this.tramiteActual?.id;
                            this.tramiteActualField.patchValue(this.tramiteActual);
                        }

                        this.cargando = true;
                        this.tramitesHttpService.guardarTramiteInactivacion(tramiteActualId, this.formulario.value).subscribe(
                            (tramiteActual) => {
                                this.descargarDocumento(tramiteActual);
                                this.formulario.reset();
                                this.cargando = false;
                                console.log('i1');
                                // this.dialogoOutput.emit(true);
                                // this.cargandoOutput.emit(false);
                                setTimeout(() => {
                                    window.location.reload();
                                }, 2000);
                                console.log('i2');
                            },
                            (error) => (this.cargando = false)
                        );
                    });
                }
            });
    }

    descargarDocumento(tramiteActual: TramiteModel) {
        const catastro = tramiteActual.catastro;
        if (catastro && tramiteActual) {
            this.catastrosHttpService.obtenerDocumentoUsuarioExterno(catastro.id!, tramiteActual.tipo?.codigo!).subscribe((documento) => {
                this.coreService.descargarDocumentoPDF(documento, tramiteActual.tipo?.codigo + '_' + catastro.numeroRegistro);
                window.location.reload();
            });
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
}
