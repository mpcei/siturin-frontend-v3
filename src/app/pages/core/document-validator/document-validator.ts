import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { CatastrosHttpService } from '@services/siturin';
import { CatastroModel } from '@models/siturin';
import { MessageService } from '@services/core';
import { Bind } from 'primeng/bind';
import { Card } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { InputText } from 'primeng/inputtext';
import { SkeletonComponent } from '../../../legacy/shared/components/skeleton/skeleton.component';
import { Divider } from 'primeng/divider';
import { DocumentValidatorStore } from './document-validator.store';
import { DocumetnValidatorData } from './document-validator.state';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { LabelDirective } from '@/utils/directives/label.directive';

@Component({
    selector: 'app-document-validator',
    templateUrl: './document-validator.html',
    imports: [Bind, Card, ButtonDirective, Ripple, FormsModule, InputText, SkeletonComponent, Divider, FormField, InputGroup, InputGroupAddon, LabelDirective]
})
export class DocumentValidator implements OnInit {
    // Servicios
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly catastrosHttpService = inject(CatastrosHttpService);
    protected readonly store = inject(DocumentValidatorStore);
    private readonly messageService = inject(MessageService);

    protected readonly form$ = signal(this.store.documetnValidatorData());
    protected readonly formData = this.buildForm();

    protected FontAwesome=FontAwesome

    cargando = signal<boolean>(false);
    catastro = signal<CatastroModel | null>(null);

    totalHabitaciones = computed(() => {
        const habitaciones = this.catastro()?.tramite?.habitaciones || [];
        return habitaciones.reduce((sum, h) => sum + (h?.habitaciones || 0), 0);
    });

    totalCamas = computed(() => {
        const habitaciones = this.catastro()?.tramite?.habitaciones || [];
        return habitaciones.reduce((sum, h) => sum + (h?.camas || 0), 0);
    });

    totalPlazas = computed(() => {
        const habitaciones = this.catastro()?.tramite?.habitaciones || [];
        return habitaciones.reduce((sum, h) => sum + (h?.plazas || 0), 0);
    });

    totalCapacidades = computed(() => {
        const transportes = this.catastro()?.tramite?.transporteTerrestres || [];
        return transportes.reduce((sum, t) => sum + (t?.capacidad || 0), 0);
    });

    // Estilos UI
    tituloClass = 'col-12 md:col-6 text-left md:text-right font-bold flex align-items-center md:justify-content-end titulo';
    textoClass = 'col-12 md:col-6 text-left flex align-items-center texto';

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params['q']) {
                // Seteamos el valor usando el signal interno
                this.formData.registerNumber().value.set(params['q']);
                this.obtenerDatos();
            }
        });
    }
    private buildForm() {
        return form<DocumetnValidatorData>(this.form$, (schema) => {
            required(schema.registerNumber);
        });
    }

    obtenerDatos() {
        if (this.formData().invalid()) {
            this.formData().markAsTouched();
            this.messageService.getErrorsCustom('Debe ingresar un número válido', 'Intente de nuevo por favor');
            return;
        }

        this.catastro.set(null);
        const numero = this.formData.registerNumber().value().trim();

        this.cargando.set(true);

        this.catastrosHttpService.obtenerCatastroValidadorDocumento(numero).subscribe({
            next: (catastro) => {
                this.catastro.set(catastro);
                this.cargando.set(false);
            },
            error: () => this.cargando.set(false)
        });
    }

    nuevaBusqueda() {
        this.catastro.set(null);
        this.store.reset();
    }
}
