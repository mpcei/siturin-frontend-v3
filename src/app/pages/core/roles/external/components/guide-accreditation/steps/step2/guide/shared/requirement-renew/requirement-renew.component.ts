import { Component, inject, input, OnInit, output, OutputEmitterRef, signal } from '@angular/core';
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
import { DatePipe, JsonPipe } from '@angular/common';
import { Divider } from 'primeng/divider';
import { FormStateService } from '@/pages/core/roles/external/services';
import { isAfter } from 'date-fns';
import { CatalogueGuideClassificationsCodeEnum, CatalogueGuideDegreesCodeEnum, CatalogueGuideRequirementsCodeEnum } from '@/pages/core/shared/components/regulation-simulator/enum';
import { Select } from 'primeng/select';

@Component({
    selector: 'app-requirement-renew',
    imports: [ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, FileUpload, JsonPipe, Divider, DatePipe, Select],
    templateUrl: './requirement-renew.component.html'
})
export class RequirementRenewComponent implements OnInit {
    public data = input<string>();
    public dataOut: OutputEmitterRef<Record<string, any>> = output<Record<string, any>>();
    protected readonly isAfter = isAfter;

    protected readonly Validators = Validators;
    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected readonly customMessageService = inject(CustomMessageService);

    private readonly catalogueService = inject(CatalogueService);
    protected readonly formStateService = inject(FormStateService);
    protected form!: FormGroup;

    protected requirements: CatalogueInterface[] = [];
    protected requirementItems = signal<Map<any, any>>(new Map());
    protected responses: Map<string, any> = new Map<string, any>();
    protected payload: FormData = new FormData();
    protected process = this.formStateService.process;
    requirement = signal<CatalogueInterface>({});
    currentDate = new Date();

    protected options: any[] = [
        { code: true, name: 'SI' },
        { code: false, name: 'NO' }
    ];

    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.loadData();

        await this.loadCatalogues();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            ruc: [null, [Validators.required]],
            photo: [null, [Validators.required]],
            certificationAux: [null],
            certificationAuxWild: [null, Validators.required],
            certificationUpdateCourse: [null, Validators.required],
            hasProtectedArea: [null]
        });

        this.formStateService.registerForm('requirement', this.form);

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            this.dataOut.emit(Array.from(this.responses.values()));
            this.formStateService.setFormErrors('requirement', this.getFormErrors());
        });

        this.hasProtectedAreaField.valueChanges.subscribe((value) => {
            if (value) {
                this.certificationUpdateCourseField.setValidators(Validators.required);
            } else {
                this.certificationUpdateCourseField.setValidators(null);
            }

            this.responses.set(value?.id, { file: null, requirement: { ...this.requirement(), value: value } });
            this.certificationUpdateCourseField.updateValueAndValidity();
        });

        this.formStateService.setFormErrors('requirement', this.getFormErrors());

        if (this.formStateService.degree().type === CatalogueGuideDegreesCodeEnum.guide) {
            const isPane = this.formStateService.catastroSiete()?.credentials?.some((item) => item.protectedAreas);
            const isLocalGuide = this.formStateService.catastroSiete()?.credentials?.some((item) => item.classificationCode === CatalogueGuideClassificationsCodeEnum.guide_local);

            if (!isLocalGuide || !isPane) {
                this.hasProtectedAreaField.setValidators(Validators.required);
                this.hasProtectedAreaField.updateValueAndValidity();
            }
        }

        const isNationalGuide = this.formStateService.catastroSiete()?.credentials?.some((item) => item.classificationCode === CatalogueGuideClassificationsCodeEnum.guide_national);

        if (isNationalGuide) {
            this.certificationAuxField.setValidators(Validators.required);
            this.certificationAuxField.updateValueAndValidity();
        }
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.rucField.invalid) errors.push('Registro Único de Contribuyentes (RUC)');
        if (this.photoField.invalid) errors.push('Fotografía emitida en los últimos 6 meses');
        if (this.certificationAuxField.invalid) errors.push('Certificado del curso de primeros auxilios vigente');
        if (this.certificationAuxWildField.invalid) errors.push('Certificado del curso de primeros auxilios en zonas agrestes vigente');
        if (this.certificationUpdateCourseField.invalid) errors.push('Certificado de aprobación de un curso de actualización de conocimientos.');

        return errors;
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
                // alert('La imagen debe ser tipo carné (30mm x 45mm)');
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
            case CatalogueGuideRequirementsCodeEnum.ruc:
                this.rucField.patchValue(data);
                break;
            case 'photo':
                this.photoField.patchValue(data);
                break;
            case CatalogueGuideRequirementsCodeEnum.certification_aux:
                this.certificationAuxField.patchValue(data);
                break;
            case CatalogueGuideRequirementsCodeEnum.certification_aux_wild:
                this.certificationAuxWildField.patchValue(data);
                break;
            case CatalogueGuideRequirementsCodeEnum.certification_update_course:
                console.log(data);
                this.certificationUpdateCourseField.patchValue(data);
                break;
        }

        this.responses.set(requirement.id!, data);
    }

    async loadCatalogues() {
        this.requirements = await this.catalogueService.findByType(CatalogueTypeEnum.requirement_item);
        this.requirementItems.set(new Map(this.requirements.map((item) => [item.code, item])));

        this.requirement.set(this.requirements.find((x) => x.code === 'pane_guide')!); //review cambiar por enum
    }

    get rucField(): AbstractControl {
        return this.form.controls['ruc'];
    }

    get photoField(): AbstractControl {
        return this.form.controls['photo'];
    }

    get certificationAuxField(): AbstractControl {
        return this.form.controls['certificationAux'];
    }

    get certificationAuxWildField(): AbstractControl {
        return this.form.controls['certificationAuxWild'];
    }

    get certificationUpdateCourseField(): AbstractControl {
        return this.form.controls['certificationUpdateCourse'];
    }

    get hasProtectedAreaField(): AbstractControl {
        return this.form.controls['hasProtectedArea'];
    }

    protected readonly CatalogueGuideRequirementsCodeEnum = CatalogueGuideRequirementsCodeEnum;
    protected readonly CatalogueGuideDegreesCodeEnum = CatalogueGuideDegreesCodeEnum;
}
