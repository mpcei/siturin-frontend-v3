import { CatalogueInterface } from '@/utils/interfaces';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, PrimeIcons } from 'primeng/api';
import { Button, ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Select } from 'primeng/select';
import { Toast, ToastModule } from 'primeng/toast';
import { InspectionStatusService } from '../../../services/inspection-status.service';
import { ActivityService, ProcessHttpService } from '@/pages/core/shared/services';
import { CustomMessageService } from '@/utils/services';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { Fluid } from 'primeng/fluid';
import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { LabelDirective } from '@/utils/directives/label.directive';
import { Message } from 'primeng/message';
import { CategoryInterface, ClassificationInterface } from '@/pages/core/shared/interfaces';
import { CatalogueCadastresStateEnum, CatalogueTypeEnum } from '@/utils/enums';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-reclassified-status',
    imports: [
            FormsModule, ReactiveFormsModule, FormsModule, ReactiveFormsModule, Select, ButtonModule, FileUpload, FileUploadModule, ToastModule, CommonModule, ErrorMessageDirective, Fluid, LabelDirective, Message
            ],
    templateUrl: './reclassified-status.component.html',
    styleUrl: './reclassified-status.component.scss',
    providers: [MessageService]
})
export class ReclassifiedStatusComponent {
    @Output() formEmitted = new EventEmitter<void>();
    @Input() cadastreId!: string;
    @Input() state!: CatalogueInterface;

    @Input() activityId!: string;
    @Input() classificationId!: string;
    @Input() categoryId!: string;

    protected readonly PrimeIcons = PrimeIcons;
    private inspectionStatusService = inject(InspectionStatusService);
    private activityService = inject(ActivityService);
    private processHttpService = inject(ProcessHttpService);
    private customMessageService = inject(CustomMessageService);
    private readonly catalogueService = inject(CatalogueService);

    private formBuilder = inject(FormBuilder);
    protected form!: FormGroup;
    protected files: any[] = [];

    protected types: CatalogueInterface[] = [];
    protected categories: CategoryInterface[] = [];
    protected classifications: ClassificationInterface[] = [];

    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.loadCatalogues();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            cadastreId: [this.cadastreId, [Validators.required]],
            state: [this.state, [Validators.required]],
            category: [null,[Validators.required]],
            classification: [null,[Validators.required]],
        });
    }

    async loadCatalogues() {
            this.types = await this.catalogueService.findByType(CatalogueTypeEnum.activities_geographic_area)
            this.classifications = await this.activityService.findClassificationsByActivity(this.activityId);
            this.categories = await this.activityService.findCategoriesByClassification(this.classificationId);

            this.categories = this.categories.filter(x => x.id !== this.categoryId)
            this.classifications = this.classifications.filter(x => x.id !== this.classificationId)
            /* this.classificationField.patchValue({id:this.classificationId}) */

    }

    onFileSelect(event: any) {
        for (const file of event.files) {
            if (file) {
                this.files.push(file);
            }
        }
    }

    onSubmit() {
        if (this.validateForm()) {
            console.log(this.form.value)
            this.createState();
        }
    }

    validateForm(): boolean {
        const errors: string[] = [];

        if (this.categoryField.invalid) errors.push('Categorias');

        if (this.files.length === 0) errors.push('Documento');

        if (errors.length > 0) {
            this.customMessageService.showFormErrors(errors);
            this.form.markAllAsTouched();
            return false;
        }

        return true;
    }

    createState() {
            const formData = new FormData();

            for (const file of this.files) {
                formData.append('files', file);
                formData.append('typeIds', this.types[0].id!);
            }

            this.processHttpService
                .createFilesInspectionStatus(this.cadastreId, formData, CatalogueCadastresStateEnum.reclassified)
                .pipe(switchMap((_) => this.inspectionStatusService.createReclassifiedInspectionStatus(this.form.value)))
                .subscribe({
                    next: (value) => {
                        this.formEmitted.emit();
                    }
                });
    }

    get categoryField(): FormControl {
        return this.form.get('category') as FormControl
    }

    get classificationField(): FormControl {
        return this.form.get('classification') as FormControl
    }
}
