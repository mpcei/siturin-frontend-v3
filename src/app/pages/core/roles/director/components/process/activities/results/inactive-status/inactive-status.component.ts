import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { CatalogueInterface } from '@utils/interfaces';
import { InspectionStatusService } from '@/pages/core/roles/technician/process/services/inspection-status.service';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { CustomMessageService, FileHttpService } from '@utils/services';
import { CatalogueCadastresStateEnum, CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { switchMap } from 'rxjs';
import { ProcessHttpService } from '@/pages/core/shared/services';

@Component({
    selector: 'app-inactive-status',
    imports: [FormsModule, ReactiveFormsModule, FormsModule, ReactiveFormsModule, MultiSelectModule, ButtonModule, FileUpload, FileUploadModule, ToastModule, CommonModule, ErrorMessageDirective, Fluid, LabelDirective, Message],
    templateUrl: './inactive-status.component.html',
    styleUrl: './inactive-status.component.scss',
    providers: [MessageService]
})
export class InactiveStatusComponent implements OnInit {
    @Output() formEmitted = new EventEmitter<void>();
    @Input() cadastreId!: string;
    @Input() state!: CatalogueInterface;

    protected readonly PrimeIcons = PrimeIcons;
    private inspectionStatusService = inject(InspectionStatusService);
    private processHttpService = inject(ProcessHttpService);
    private customMessageService = inject(CustomMessageService);
    private readonly catalogueService = inject(CatalogueService);
    private readonly fileHttpService = inject(FileHttpService);

    private formBuilder = inject(FormBuilder);
    protected form!: FormGroup;
    protected files: any[] = [];

    inactivationCauses: CatalogueInterface[] = [];

    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.loadCatalogues();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            cadastreId: [this.cadastreId, [Validators.required]],
            inactivationCauses: [[], [Validators.required]],
            inactivationCauseType: [null, [Validators.required]],
            state: [this.state, [Validators.required]]
        });
    }

    async loadCatalogues() {
        this.inactivationCauses = await this.catalogueService.findByType(CatalogueTypeEnum.internal_inactivation_causes);
        this.inactivationCauseTypeField.patchValue(await this.catalogueService.findByCode('de_oficio', CatalogueTypeEnum.inactivation_cause_type));
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
            this.createState();
        }
    }

    validateForm(): boolean {
        const errors: string[] = [];

        if (this.inactivationCausesField.invalid) errors.push('Causales de inactivación');

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
            formData.append('typeIds', this.inactivationCauses[0].id!);
        }

        this.processHttpService
            .createFilesInspectionStatus(this.cadastreId, formData, CatalogueCadastresStateEnum.inactive)
            .pipe(switchMap((_) => this.inspectionStatusService.createInactivationInspectionStatus(this.form.value)))
            .subscribe({
                next: (value) => {
                    this.formEmitted.emit();
                }
            });
    }

    get inactivationCausesField(): AbstractControl {
        return this.form.controls['inactivationCauses'];
    }

    get inactivationCauseTypeField(): AbstractControl {
        return this.form.controls['inactivationCauseType'];
    }
}
