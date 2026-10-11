import { Component, EventEmitter, OnInit, Output,inject } from '@angular/core';
import { CatalogueModel } from '@models/core';
import { CreateUserDto, RoleModel, UpdateUserDto } from '@models/auth';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthHttpService, UsersHttpService } from '@services/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService, CoreService, MessageService } from '@services/core';
import { RolesHttpService } from '@services/auth/roles-http.service';
import { CatalogoModel } from '@models/siturin/catalogo.model';
import { ActividadesHttpService } from '@services/siturin/actividades-http.service';
import { ClasificacionesHttpService } from '@services/siturin/clasificaciones-http.service';
import { CategoriasHttpService } from '@services/siturin/categorias-http.service';
import { ActividadCodigoEnum, CatalogoSiturinTipoEnum, NormativaTypeEnum, RucTipoContribuyenteEnum } from '@shared/enums';
import { ActividadModel, CategoriaModel, ClasificacionModel } from '@models/siturin';
import { CatalogosSiturinHttpService, CatalogosSiturinService, NormativasService } from '@services/siturin';
import { environment } from '@env/environment';
import { NgIf } from '@angular/common';
import { SkeletonComponent } from '../../../../legacy/shared/components/skeleton/skeleton.component';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { LabelDirective } from '../../../../legacy/shared/directives/label.directive';
import { Select } from 'primeng/select';
import { ErrorMessageDirective } from '../../../../legacy/shared/directives/error-message.directive';
import { AlojamientoComponent } from '../actividades/alojamiento/alojamiento.component';
import { AlimentosComponent } from '../actividades/alimentos/alimentos.component';
import { ParquesComponent } from '../actividades/parques/parques.component';
import { EventosComponent } from '../actividades/eventos/eventos.component';
import { OperacionIntermediacionComponent } from '../actividades/operacion-intermediacion/operacion-intermediacion.component';
import { TransporteComponent } from '../actividades/transporte/transporte.component';
import { CtcComponent } from '../actividades/ctc/ctc.component';
import { NormativaComponent } from '../../compartido/normativa/normativa.component';
import { NormativaGenericaComponent } from '../../compartido/normativa-generica/normativa-generica.component';
import { Panel } from 'primeng/panel';

import { Tabs } from 'primeng/tabs';
import { TabList } from 'primeng/tabs';
import { Tab } from 'primeng/tabs';
import { TabPanels } from 'primeng/tabs';
import { TabPanel } from 'primeng/tabs';
@Component({
    selector: 'app-actividad-turistica',
    templateUrl: './actividad-turistica.component.html',
    styleUrls: ['./actividad-turistica.component.scss'],
    imports: [
        NgIf,
        SkeletonComponent,
        Bind,
        Card,
        Divider,
        ReactiveFormsModule,
        LabelDirective,
        Select,
        ErrorMessageDirective,
        AlojamientoComponent,
        AlimentosComponent,
        ParquesComponent,
        EventosComponent,
        OperacionIntermediacionComponent,
        TransporteComponent,
        CtcComponent,
        NormativaComponent,
        NormativaGenericaComponent,
        Panel,
        Tabs,
        TabList,
        Tab,
        TabPanels,
        TabPanel
    ]
})
export class ActividadTuristicaComponent implements OnInit {
    @Output() personeriaJuridicaOut = new EventEmitter();
    private catalogosSiturinService = inject(CatalogosSiturinService);
    private catalogosSiturinHttpService = inject(CatalogosSiturinHttpService);
    private actividadesHttpService = inject(ActividadesHttpService);
    private clasificacionesHttpService = inject(ClasificacionesHttpService);
    private categoriasHttpService = inject(CategoriasHttpService);
    private coreService = inject(CoreService);
    private formBuilder = inject(UntypedFormBuilder);
    public messageService = inject(MessageService);
    private router = inject(Router);
    private rolesHttpService = inject(RolesHttpService);
    private usersHttpService = inject(UsersHttpService);
    private normativasService = inject(NormativasService);
    id: string = '';
    bloodTypes: CatalogueModel[] = [];
    roles: RoleModel[] = [];
    form: UntypedFormGroup = this.newForm;
    panelHeader: string = 'Simulador para Identificar Actividad Turística y Clasificación';
    isLoadingSkeleton: boolean = false;
    loaded$ = this.coreService.loaded$;
    personeriaJuridicas: CatalogoModel[] = [];
    zonasGeograficas: CatalogoModel[] = [];
    actividades: ActividadModel[] = [];
    clasificaciones: ClasificacionModel[] = [];
    categorias: CategoriaModel[] = [];
    mostrarNormativa: boolean = false;

    constructor() {
        this.personeriaJuridicaField.valueChanges.subscribe((value) => {
            // this.actividades = [];
            // this.clasificaciones = [];
            // this.categorias = [];
            this.mostrarNormativa = false;
        });

        this.zonaGeograficaField.valueChanges.subscribe((value) => {
            this.obtenerActividades(value.id);
            this.actividades = [];
            this.clasificaciones = [];
            this.categorias = [];
            this.actividadField.setValue(null);
            this.clasificacionField.setValue(null);
            this.categoriaField.setValue(null);
            this.mostrarNormativa = false;
        });

        this.actividadField.valueChanges.subscribe((value) => {
            this.obtenerClasificaciones(value.id);
            this.clasificaciones = [];
            this.categorias = [];
            this.mostrarNormativa = false;
        });

        this.clasificacionField.valueChanges.subscribe((value) => {
            this.obtenerCategorias(value.id);
            this.categorias = [];
            this.mostrarNormativa = false;

            if (value?.tieneNormativa) {
                this.mostrarNormativa = true;
            }
        });

        this.categoriaField.valueChanges.subscribe((value) => {
            this.mostrarNormativa = false;
            if (value?.tieneNormativa) {
                this.mostrarNormativa = true;
            }
        });
    }

    async onExit(): Promise<boolean> {
        if (this.form.touched || this.form.dirty) {
            return await this.messageService.questionOnExit().then((result:any) => result.isConfirmed);
        }
        return true;
    }

    ngOnInit(): void {
        this.catalogosSiturinHttpService.obtenerCatalogos().subscribe((response) => {
            this.obtenerPersoneriaJuridicas(response);
            this.obtenerZonasGeograficas(response);
        });

        // this.personeriaJuridicaField.valueChanges.subscribe(value => {
        //   this.tieneActividadField.clearValidators();
        //   this.tieneNombramientoVigenteField.clearValidators();
        //
        //   if (value && value.codigo === RucTipoContribuyenteEnum.JURIDICA) {
        //     this.tieneActividadField.setValidators([Validators.required]);
        //     this.tieneNombramientoVigenteField.setValidators([Validators.required]);
        //   }
        //
        //   this.tieneActividadField.updateValueAndValidity();
        //   this.tieneNombramientoVigenteField.updateValueAndValidity();
        // });
    }

    get newForm(): UntypedFormGroup {
        return this.formBuilder.group({
            personeriaJuridica: [null, [Validators.required]],
            zonaGeografica: [null, [Validators.required]],
            actividad: [null, [Validators.required]],
            clasificacion: [null, [Validators.required]],
            categoria: [null, [Validators.required]]
        });
    }

    obtenerPersoneriaJuridicas(catalogos: CatalogoModel[]) {
        this.personeriaJuridicas = catalogos.filter((catalogo: CatalogoModel) => catalogo.tipo === CatalogoSiturinTipoEnum.RUC_TIPOS_CONTRIBUYENTES);
    }

    obtenerZonasGeograficas(catalogos: CatalogoModel[]) {
        this.zonasGeograficas = catalogos.filter((catalogo: CatalogoModel) => catalogo.tipo === CatalogoSiturinTipoEnum.ZONAS_GEOGRAFICAS);
    }

    obtenerActividades(zonaGeograficaId: number) {
        this.actividadesHttpService.obtenerActividadesPorZonaGeografica(zonaGeograficaId).subscribe((actividades) => {
            this.actividades = actividades;
            if (this.personeriaJuridicaField.value.codigo === RucTipoContribuyenteEnum.NATURAL) {
                this.actividades = actividades.filter((actividad) => {
                    return actividad.codigo != ActividadCodigoEnum.OPERACION_INTERMEDIACION_CONTINENTE && actividad.codigo != ActividadCodigoEnum.OPERACION_INTERMEDIACION_GALAPAGOS;
                });
            }
        });
    }

    obtenerClasificaciones(actividadId: number) {
        this.clasificacionesHttpService.obtenerClasificacionesPorActividad(actividadId).subscribe((catalogos) => {
            this.clasificaciones = catalogos;
        });
    }

    obtenerCategorias(clasificacionId: number) {
        this.categoriasHttpService.obtenerCategoriasPorClasificacion(clasificacionId).subscribe((categorias) => {
            this.categorias = categorias;
        });
    }

    cargarNormativaPorClasificacion() {
        this.mostrarNormativa = false;
        if (this.clasificacionField.value?.tieneNormativa) {
            this.mostrarNormativa = true;
            this.normativasService.setModelo(this.clasificacionField.value.id, NormativaTypeEnum.CLASIFICACION);
        }
    }

    cargarNormativaPorCategoria() {
        this.mostrarNormativa = false;

        if (this.categoriaField.value?.tieneNormativa) {
            this.mostrarNormativa = true;
            this.normativasService.setModelo(this.categoriaField.value.id, NormativaTypeEnum.CATEGORIA);
        }
    }

    onSubmit(): void {
        if (this.form.valid) {
            if (this.id != '') {
                this.update(this.form.value);
            } else {
                this.create(this.form.value);
            }
        } else {
            this.form.markAllAsTouched();
            this.messageService.errorsFields.then();
        }
    }

    back(): void {
        this.router.navigate(['/administration/users']);
    }

    create(user: CreateUserDto): void {
        user.passwordChanged = !user.passwordChanged;
        this.usersHttpService.create(user).subscribe((user) => {
            this.form.reset(user);
            this.back();
        });
    }

    loadRoles(): void {
        this.rolesHttpService.findAll().subscribe((roles) => (this.roles = roles));
    }

    getUser(): void {
        this.isLoadingSkeleton = true;
        this.usersHttpService.findOne(this.id).subscribe((user) => {
            this.isLoadingSkeleton = false;
            this.form.patchValue(user);
        });
    }

    update(user: UpdateUserDto): void {
        user.passwordChanged = !user.passwordChanged;

        this.usersHttpService.update(this.id, user).subscribe((user) => {
            this.form.reset(user);
            this.back();
        });
    }

    get personeriaJuridicaField(): AbstractControl {
        return this.form.controls['personeriaJuridica'];
    }

    get zonaGeograficaField(): AbstractControl {
        return this.form.controls['zonaGeografica'];
    }

    get actividadField(): AbstractControl {
        return this.form.controls['actividad'];
    }

    get clasificacionField(): AbstractControl {
        return this.form.controls['clasificacion'];
    }

    get categoriaField(): AbstractControl {
        return this.form.controls['categoria'];
    }

    protected readonly environment = environment;
}
