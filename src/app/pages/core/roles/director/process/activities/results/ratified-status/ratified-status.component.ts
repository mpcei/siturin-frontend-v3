import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageService, PrimeIcons } from 'primeng/api';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InspectionStatusService } from '@/pages/core/roles/technician/process/services/inspection-status.service';
import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { LabelDirective } from '@/utils/directives/label.directive';
import { Fluid } from 'primeng/fluid';
import { Message } from 'primeng/message';
import { CatalogueInterface } from '@/utils/interfaces';
import { ProcessHttpService } from '@/pages/core/shared/services';
import { CustomMessageService, FileHttpService } from '@/utils/services';
import { CatalogueService } from '@/utils/services/catalogue.service';
import { switchMap } from 'rxjs';
import { CatalogueCadastresStateEnum } from '@/utils/enums';

@Component({
    selector: 'app-ratified-status',
    imports: [FormsModule, ReactiveFormsModule, FormsModule, ReactiveFormsModule, ButtonModule, FileUpload, FileUploadModule, ToastModule, CommonModule, Fluid, LabelDirective],
    templateUrl: './ratified-status.component.html',
    styleUrl: './ratified-status.component.scss',
    providers: [MessageService]
})
export class RatifiedStatusComponent implements OnInit {

    @Output() formEmitted = new EventEmitter<void>();
    @Input() cadastreId!: string;
    @Input() state!: CatalogueInterface;

    protected readonly PrimeIcons = PrimeIcons;
    private inspectionStatusService = inject(InspectionStatusService);
    private processHttpService = inject(ProcessHttpService);
    private customMessageService = inject(CustomMessageService);
    private readonly fileHttpService = inject(FileHttpService);

    private formBuilder = inject(FormBuilder);
    protected form!: FormGroup;
    protected files: any[] = [];

    constructor() {}

    async ngOnInit() {
        this.buildForm();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            cadastreId: [this.cadastreId, [Validators.required]],
            state: [this.state, [Validators.required]]
        });
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

        console.log(this.form.value)
        if (this.stateField.invalid) errors.push('Ratificado');

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
            formData.append('typeIds', this.state.id!);
        }

        this.processHttpService
            .createFilesInspectionStatus(this.cadastreId, formData, CatalogueCadastresStateEnum.ratified)
            .pipe(switchMap((_) => this.inspectionStatusService.createRatifiedInspectionState(this.form.value)))
            .subscribe({
                next: (value) => {
                    this.formEmitted.emit();
                }
            });
    }

    get stateField(): AbstractControl {
        return this.form.controls['state'];
    }
}

