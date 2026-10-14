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
import { DocumentTechnicalCapacities } from './components/document-technical-capacities';
import { DocumentLocationContact } from './components/document-location-contact';
import { DocumentGeneralInfo } from './components/document-general-info';

@Component({
    selector: 'app-document-validator',
    templateUrl: './document-validator.html',
    imports: [Bind, ButtonDirective, Ripple, FormsModule, InputText, SkeletonComponent, FormField, InputGroup, InputGroupAddon, LabelDirective, DocumentTechnicalCapacities, DocumentLocationContact, DocumentGeneralInfo]
})
export class DocumentValidator implements OnInit {
    private readonly activatedRoute = inject(ActivatedRoute);
    private readonly catastrosHttpService = inject(CatastrosHttpService);
    protected readonly store = inject(DocumentValidatorStore);
    private readonly messageService = inject(MessageService);

    protected readonly form$ = signal(this.store.documetnValidatorData());
    protected readonly formData = this.buildForm();

    protected FontAwesome=FontAwesome

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params) => {
            if (params['q']) {
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

        this.store.catastro.set(null);
        const numero = this.formData.registerNumber().value().trim();

        this.store.loaded.set(true);

        this.catastrosHttpService.obtenerCatastroValidadorDocumento(numero).subscribe({
            next: (catastro) => {
                this.store.catastro.set(catastro);
                this.store.loaded.set(false);
            },
            error: () => this.store.loaded.set(false)
        });
    }

    nuevaBusqueda() {
        this.store.catastro.set(null);
        this.store.reset();
    }
}
