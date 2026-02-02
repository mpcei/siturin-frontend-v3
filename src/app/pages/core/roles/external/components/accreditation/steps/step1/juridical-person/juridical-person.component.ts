import { Component, effect, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Select } from 'primeng/select';
import { CustomMessageService } from '@utils/services';
import { CatalogueInterface } from '@utils/interfaces';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueTypeEnum } from '@utils/enums';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';

@Component({
    selector: 'app-juridical-person',
    imports: [Fluid, LabelDirective, ReactiveFormsModule, Select, Message, ErrorMessageDirective, ToggleSwitchComponent],
    templateUrl: './juridical-person.component.html',
    styleUrl: './juridical-person.component.scss'
})
export class JuridicalPersonComponent implements OnInit {
    dataIn = input<any>(null);
    @Output() dataOut = new EventEmitter<FormGroup>();

    private readonly catalogueService = inject(CatalogueService);

    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected formInitialized = false;

    //Catalogues
    protected legalEntities: CatalogueInterface[] = [];
    protected otroCatalogo: CatalogueInterface[] = [];

    constructor() {
        effect(() => {
            if (this.dataIn() && !this.formInitialized) {
                this.formInitialized = true;
                this.loadData();
            }
        });
    }

    async ngOnInit() {
        this.buildForm();
        await this.loadCatalogues();
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            legalEntity: [null, [Validators.required]],
            hasPersonDesignation: [false, [Validators.requiredTrue]],
            hasTouristActivityDocument: [false, [Validators.requiredTrue]]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.subscribe(() => {
            if (this.form.valid) this.dataOut.emit(this.form);
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.legalEntityField.invalid) errors.push('Tipo de Personería Jurídica');

        if (this.hasPersonDesignationField.invalid) errors.push('Nombramiento vigente del o los representantes legales, debidamente inscrito ante la autoridad correspondiente');

        if (this.hasTouristActivityDocumentField.invalid) errors.push('Documento constitutivo de la misma debidamente aprobada por la autoridad correspondiente, en la que conste como su objeto social el desarrollo de la actividad turística');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {
        if (this.dataIn()) {
            this.form.patchValue(this.dataIn());
        }
    }

    async loadCatalogues() {
        this.legalEntities = await this.catalogueService.findByType(CatalogueTypeEnum.processes_legal_entity);
    }

    get legalEntityField(): AbstractControl {
        return this.form.get('legalEntity')!;
    }

    get hasPersonDesignationField(): AbstractControl {
        return this.form.get('hasPersonDesignation')!;
    }

    get hasTouristActivityDocumentField(): AbstractControl {
        return this.form.get('hasTouristActivityDocument')!;
    }
}
