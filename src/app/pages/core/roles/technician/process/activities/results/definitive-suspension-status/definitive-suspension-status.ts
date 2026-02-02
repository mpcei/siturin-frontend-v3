import { ProcessHttpService } from '@/pages/core/shared/services';
import { CatalogueCadastresStateEnum } from '@/utils/enums';
import { CatalogueInterface } from '@/utils/interfaces';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { switchMap } from 'rxjs';
import { InspectionStatusService } from '../../../services/inspection-status.service';
import { CustomMessageService, FileHttpService } from '@/utils/services';
import { PrimeIcons } from 'primeng/api';
import { LabelDirective } from '@/utils/directives/label.directive';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { Fluid } from 'primeng/fluid';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-definitive-suspension-status',
    imports: [FormsModule, ReactiveFormsModule, FormsModule, ReactiveFormsModule, ButtonModule, FileUpload, FileUploadModule, ToastModule, CommonModule, Fluid, LabelDirective],
    templateUrl: './definitive-suspension-status.html',
    styleUrl: './definitive-suspension-status.scss'
})
export class DefinitiveSuspensionStatus {
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

        console.log(this.form.value);
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
            .createFilesInspectionStatus(this.cadastreId, formData, CatalogueCadastresStateEnum.definitive_suspension)
            .pipe(switchMap((_) => this.inspectionStatusService.createDefinitiveSuspensionInspectionStatus(this.form.value)))
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
