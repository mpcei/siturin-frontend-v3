import { ProcessHttpService } from '@/pages/core/shared/services';
import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { LabelDirective } from '@/utils/directives/label.directive';
import { CatalogueTypeEnum, CatalogueCadastresStateEnum } from '@/utils/enums';
import { CatalogueInterface } from '@/utils/interfaces';
import { CustomMessageService, FileHttpService } from '@/utils/services';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService, PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Fluid } from 'primeng/fluid';
import { Message } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { switchMap } from 'rxjs';
import { InspectionStatusService } from '../../../services/inspection-status.service';

@Component({
  selector: 'app-temporary-suspension-status',
  imports: [FormsModule, ReactiveFormsModule, FormsModule, ReactiveFormsModule, MultiSelectModule, ButtonModule, FileUpload, FileUploadModule, ToastModule, CommonModule, ErrorMessageDirective, Fluid, LabelDirective, Message],
  templateUrl: './temporary-suspension-status.component.html',
  styleUrl: './temporary-suspension-status.component.scss',
  providers: [MessageService]
})
export class TemporarySuspensionStatusComponent {

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

    breachCausesType: CatalogueInterface[] = [];

    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.loadCatalogues();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            cadastreId: [this.cadastreId, [Validators.required]],
            breachCauses: [[], [Validators.required]],
            state: [this.state, [Validators.required]]
        });
    }

    async loadCatalogues() {
        this.breachCausesType = await this.catalogueService.findByType(CatalogueTypeEnum.breach_causes);
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

        if (this.breachCausesField.invalid) errors.push('Caussas de ruptura');

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
            formData.append('typeIds', this.breachCausesType[0].id!);
        }

        this.processHttpService
            .createFilesInspectionStatus(this.cadastreId, formData, CatalogueCadastresStateEnum.temporary_suspension)
            .pipe(switchMap((_) => this.inspectionStatusService.createTemporarySuspensionInspectionStatus(this.form.value)))
            .subscribe({
                next: (value) => {
                    this.formEmitted.emit();
                }

            });

    }

    get breachCausesField(): AbstractControl {
        return this.form.controls['breachCauses'];
    }
}
