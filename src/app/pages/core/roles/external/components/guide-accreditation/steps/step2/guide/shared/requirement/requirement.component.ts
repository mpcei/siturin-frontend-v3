import { Component, inject, input, OnInit, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PrimeIcons } from 'primeng/api';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { FileUpload } from 'primeng/fileupload';
import { JsonPipe } from '@angular/common';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';
import { Divider } from 'primeng/divider';

@Component({
    selector: 'app-requirement',
    imports: [ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, FileUpload, JsonPipe, ToggleSwitchComponent, Divider],
    templateUrl: './requirement.component.html'
})
export class RequirementComponent implements OnInit {
    public data = input<string>();
    public dataOut: OutputEmitterRef<Record<string, any>> = output<Record<string, any>>();

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    private readonly catalogueService = inject(CatalogueService);

    protected form!: FormGroup;

    protected requirements: CatalogueInterface[] = [];
    protected requirementItems: Map<any, any> = new Map();
    protected responses: Map<string, any> = new Map<string, any>();
    protected payload: FormData = new FormData();
    constructor() {}

    async ngOnInit() {
        this.buildForm();
        await this.loadCatalogues();
        this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            ruc: [null, [Validators.required]],
            titleBachiller: ['Guia de Turismo', Validators.required],
            photo: [null, [Validators.required]],
            certificationGuideLocal: [null, Validators.required],
            certificationAuxWild24: [null, Validators.required],
            domicileDeclaration: [null, Validators.requiredTrue]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            console.log(Array.from(this.responses.values()));

            this.dataOut.emit(Array.from(this.responses.values()));
        });

        this.domicileDeclarationField.valueChanges.subscribe((value) => {
            if (value) {
                let data = {
                    requirement: {
                        ...this.requirementItems.get('domicile_declaration'),
                        value
                    }
                };

                this.responses.set(value.id!, data);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.rucField.invalid) errors.push('Registro Único de Contribuyentes (RUC)');
        if (this.photoField.invalid) errors.push('Fotografía emitida en los últimos 6 meses');
        if (this.certificationGuideLocalField.invalid) errors.push('Certificado  de  aprobación del  curso  para  guía  de  turismo local  del  cantón  en  la  que realizará la actividad de guianza');
        if (this.certificationAuxWild24Field.invalid) errors.push('Certificado vigente de aprobación del curso de primeros auxilios en zonas agrestes en modalidad presencial');
        if (this.titleBachillerField.invalid) errors.push('Título de bachiller reconocido por la autoridad nacional competente a nivel nacional ');
        if (this.domicileDeclarationField.invalid) errors.push('Declaración responsable del domicilio del solicitante que ejercerá la actividad de guianza turística');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    changeDomicileDeclaration(event: any) {
        this.domicileDeclarationField.patchValue({
            ...this.domicileDeclarationField.value,
            value: event.target.checked
        });
    }
    loadData() {}

    onFileSelect(requirement: CatalogueInterface, event: any) {
        const img = new Image();
        const objectUrl = URL.createObjectURL(event.files[0]);

        img.onload = () => {
            const width = img.width;
            const height = img.height;

            // Dimensiones esperadas (aprox)
            const expectedWidth = 354;
            const expectedHeight = 531;

            // Tolerancia (opcional)
            const tolerance = 10;

            if (Math.abs(width - expectedWidth) <= tolerance && Math.abs(height - expectedHeight) <= tolerance) {
                console.log('Imagen válida ✅');
            } else {
                console.error('Imagen NO válida ❌');
                alert('La imagen debe ser tipo carné (30mm x 45mm)');
            }

            URL.revokeObjectURL(objectUrl);
        };

        img.src = objectUrl;

        let data = {
            file: event.files[0],
            requirement: { ...requirement, value: 'file' },
            img: URL.createObjectURL(event.files[0])
        };

        switch (requirement.code) {
            case 'ruc':
                this.rucField.patchValue(data);
                break;
            case 'title_bachiller':
                this.titleBachillerField.patchValue(data);
                break;
            case 'photo':
                this.photoField.patchValue(data);
                break;
            case 'certification_guide_local':
                this.certificationGuideLocalField.patchValue(data);
                break;
            case 'certification_aux_wild_24':
                this.certificationAuxWild24Field.patchValue(data);
                break;
        }

        this.responses.set(requirement.id!, data);
    }

    async loadCatalogues() {
        this.requirements = await this.catalogueService.findByType(CatalogueTypeEnum.requirement_item);

        this.requirementItems = new Map(this.requirements.map((item) => [item.code, item]));
    }

    get rucField(): AbstractControl {
        return this.form.controls['ruc'];
    }

    get titleBachillerField(): AbstractControl {
        return this.form.controls['titleBachiller'];
    }

    get photoField(): AbstractControl {
        return this.form.controls['photo'];
    }

    get certificationGuideLocalField(): AbstractControl {
        return this.form.controls['certificationGuideLocal'];
    }

    get certificationAuxWild24Field(): AbstractControl {
        return this.form.controls['certificationAuxWild24'];
    }

    get domicileDeclarationField(): AbstractControl {
        return this.form.controls['domicileDeclaration'];
    }
}
