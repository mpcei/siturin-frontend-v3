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
import { Tag } from 'primeng/tag';
import { isAfter } from 'date-fns';

@Component({
    selector: 'app-requirement-current',
    imports: [ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, FileUpload, JsonPipe, Divider, Tag, DatePipe],
    templateUrl: './requirement-current.component.html'
})
export class RequirementCurrentComponent implements OnInit {
    public data = input<string>();
    public dataOut: OutputEmitterRef<Record<string, any>> = output<Record<string, any>>();

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
    currentDate = new Date();

    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.loadData();

        await this.loadCatalogues();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            ruc: [null, [Validators.required]],
            photo: [null, [Validators.required]]
        });

        this.formStateService.registerForm('requirement', this.form);

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
            this.dataOut.emit(Array.from(this.responses.values()));
            this.formStateService.setFormErrors('requirement', this.getFormErrors());
        });

        this.formStateService.setFormErrors('requirement', this.getFormErrors());
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.rucField.invalid) errors.push('Registro Único de Contribuyentes (RUC)');
        if (this.photoField.invalid) errors.push('Fotografía emitida en los últimos 6 meses');

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
            case 'photo':
                this.photoField.patchValue(data);
                break;
        }

        this.responses.set(requirement.id!, data);
    }

    async loadCatalogues() {
        this.requirements = await this.catalogueService.findByType(CatalogueTypeEnum.requirement_item);
        this.requirementItems.set(new Map(this.requirements.map((item) => [item.code, item])));
    }

    get rucField(): AbstractControl {
        return this.form.controls['ruc'];
    }

    get photoField(): AbstractControl {
        return this.form.controls['photo'];
    }

    protected readonly isAfter = isAfter;
}
