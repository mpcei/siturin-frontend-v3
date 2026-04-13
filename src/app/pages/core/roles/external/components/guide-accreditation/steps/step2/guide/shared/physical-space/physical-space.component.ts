import { Component, EventEmitter, inject, input, Input, OnInit, output, Output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { Select } from 'primeng/select';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { Message } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { FileUpload } from 'primeng/fileupload';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-physical-space',
    imports: [Fluid, ReactiveFormsModule, LabelDirective, Select, Message, ErrorMessageDirective, ToggleSwitch, FileUpload, JsonPipe],
    templateUrl: './physical-space.component.html'
})
export class PhysicalSpaceComponent implements OnInit {
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
            photo: [null, [Validators.required]],
            certificationGuideLocal: [false, Validators.required],
            professionalTitle: [false, Validators.required],
            domicileDeclaration: [false, Validators.required]
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            this.dataOut.emit(Array.from(this.responses.values()));
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.rucField.invalid) errors.push('RUC');
        if (this.photoField.invalid) errors.push('Fotografía');
        if (this.certificationGuideLocalField.invalid) errors.push('Certificado Guia Local');
        if (this.professionalTitleField.invalid) errors.push('Titulo Profesional');
        if (this.domicileDeclarationField.invalid) errors.push('Declaración de Domicilio');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    loadData() {}

    onFileSelect(requirement: CatalogueInterface, event: any) {
        let file = {
            file: event.files[0],
            requirement,
            img: URL.createObjectURL(event.files[0])
        };

        switch (requirement.code) {
            case 'ruc':
                this.rucField.patchValue(file);
                break;
            case 'photo':
                this.photoField.patchValue(file);
                break;
            case 'certificationGuideLocal':
                this.certificationGuideLocalField.patchValue(file);
                break;
            case 'professionalTitle':
                this.professionalTitleField.patchValue(file);
                break;
            case 'domicileDeclaration':
                this.domicileDeclarationField.patchValue(file);
                break;
        }

        this.responses.set(requirement.id!, file);
    }

    async loadCatalogues() {
        this.requirements = await this.catalogueService.findByType(CatalogueTypeEnum.requirement_item);
        this.requirementItems = new Map(this.requirements.map((item) => [item.code, item]));
    }

    get rucField(): AbstractControl {
        return this.form.controls['ruc'];
    }

    get photoField(): AbstractControl {
        return this.form.controls['photo'];
    }

    get certificationGuideLocalField(): AbstractControl {
        return this.form.controls['certificationGuideLocal'];
    }

    get professionalTitleField(): AbstractControl {
        return this.form.controls['professionalTitle'];
    }

    get domicileDeclarationField(): AbstractControl {
        return this.form.controls['domicileDeclaration'];
    }
}
