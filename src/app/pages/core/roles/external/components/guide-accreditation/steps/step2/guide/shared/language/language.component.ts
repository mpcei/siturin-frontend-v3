import { Component, effect, inject, input, OnInit, output, OutputEmitterRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Fluid } from 'primeng/fluid';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Message } from 'primeng/message';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { ListBasicComponent } from '@utils/components/list-basic/list-basic.component';
import { DialogModule } from 'primeng/dialog';
import { CatalogueInterface, ColInterface } from '@utils/interfaces';
import { deleteButtonAction } from '@utils/components/button-action/consts';
import { CustomMessageService } from '@utils/services';
import { CatalogueTypeEnum } from '@utils/enums';
import { CatalogueService } from '@utils/services/catalogue.service';
import { ToggleSwitchComponent } from '@utils/components/toggle-switch/toggle-switch.component';
import { FileUpload } from 'primeng/fileupload';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';
import { CatalogueGuideClassificationsCodeEnum } from '@/pages/core/shared/components/regulation-simulator/enum';

export interface LanguageInterface {
    id?: string;
    level?: CatalogueInterface;
    language?: CatalogueInterface;
    file?: any;
}

@Component({
    selector: 'app-language',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        Fluid,
        LabelDirective,
        Select,
        ButtonModule,
        TooltipModule,
        Message,
        ErrorMessageDirective,
        ToastModule,
        ConfirmDialogModule,
        ListBasicComponent,
        DialogModule,
        ToggleSwitchComponent,
        FileUpload,
        ButtonActionComponent
    ],
    templateUrl: './language.component.html'
})
export class LanguageComponent implements OnInit {
    public dataOut: OutputEmitterRef<Record<string, any>> = output<Record<string, any>>();
    public classification = input.required<ClassificationInterface>();

    protected readonly PrimeIcons = PrimeIcons;

    private readonly formBuilder = inject(FormBuilder);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly catalogueService = inject(CatalogueService);
    protected readonly customMessageService = inject(CustomMessageService);

    protected form!: FormGroup;
    protected modalityForm!: FormGroup;

    protected isVisibleModal = false;
    protected cols: ColInterface[] = [];
    protected items: LanguageInterface[] = [];
    protected buttonActions: MenuItem[] = [];
    protected isButtonActionsEnabled: boolean = false;

    protected availableLanguages: CatalogueInterface[] = [];
    protected languages: CatalogueInterface[] = [];
    protected levels: CatalogueInterface[] = [];
    protected requirements: CatalogueInterface[] = [];
    protected responses: Map<string, any> = new Map<string, any>();

    constructor() {}

    async ngOnInit() {
        this.buildForm();
        this.buildColumns();
        await this.loadCatalogues();
    }

    buildButtonActions(item: any, index: number) {
        this.buttonActions = [
            {
                ...deleteButtonAction,
                command: () => {
                    if (item) this.deleteItem(item);
                }
            }
        ];

        this.isButtonActionsEnabled = true;
    }

    buildColumns() {
        this.cols = [
            { header: 'Tipo de idioma extranjero', field: 'language', type: 'object' },
            { header: 'Nivel de conocimiento del idioma extranjero', field: 'level', type: 'object' },
            { header: 'Certificado de idiomas', field: 'file', type: 'object' }
        ];
    }

    buildForm() {
        this.modalityForm = this.formBuilder.group({
            id: [null],
            language: [null, Validators.required],
            level: [null, Validators.required],
            motherLanguage: [{ value: null, disabled: true }],
            file: [null, Validators.required]
        });

        this.form = this.formBuilder.group({
            requirement: [null, Validators.required],
            hasLanguage: false,
            languages: []
        });

        this.watchFormChanges();
    }

    watchFormChanges() {
        this.hasLanguageField.valueChanges.subscribe((_) => {
            this.updateFormAndEmit();
        });

        this.languageField.valueChanges.subscribe((value) => {
            if (value && this.classification().code !== CatalogueGuideClassificationsCodeEnum.guide_local && value.code === 'es') {
                this.motherLanguageField.enable();
                this.motherLanguageField.setValidators([Validators.requiredTrue]);
                this.motherLanguageField.updateValueAndValidity();
            }
        });
    }

    async loadCatalogues() {
        const [languages, levels, requirements] = await Promise.all([
            this.catalogueService.findByType(CatalogueTypeEnum.guide_languages_name),
            this.catalogueService.findByType(CatalogueTypeEnum.guide_languages_level),
            this.catalogueService.findByType(CatalogueTypeEnum.requirement_item)
        ]);

        this.availableLanguages = languages;
        this.levels = levels;
        this.requirements = requirements;

        this.requirementField.patchValue(this.requirements.find((x) => x.code === 'certification_language'));
    }

    onSubmit() {
        if (this.validateModalityForm()) {
            this.createItem();
        }
    }

    validateModalityForm() {
        const errors: string[] = [];

        if (this.languageField.invalid) errors.push('Tipo de idioma extranjero');
        if (this.levelField.invalid) errors.push('Nivel de conocimiento del idioma extranjero');
        if (this.motherLanguageField.invalid) errors.push('Lengua materna');
        if (this.fileField.invalid) errors.push('Certificado de idiomas');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            this.customMessageService.showFormErrors(errors);
            return false;
        }

        return true;
    }

    getFormErrors() {
        const errors: string[] = [];

        if (this.hasLanguageField.value && this.items.length === 0) errors.push('Si marcó que Sí en Idiomas debe agregar un idioma');

        if (this.classification().code !== CatalogueGuideClassificationsCodeEnum.guide_local && this.items.length === 0) errors.push('Idiomas');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
            return errors;
        }

        return [];
    }

    onSelect({ item, index }: { item: any; index: number }) {
        if (!item) {
            this.customMessageService.showError({ summary: 'El registro no existe', detail: 'Vuelva a intentar' });
            return;
        }

        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
    }

    createItem() {
        const language = this.languageField.value;

        if (this.items.some((i) => i.language?.code === language?.code)) {
            this.customMessageService.showError({
                summary: 'Aviso',
                detail: 'La modalidad ya existe'
            });
            return;
        }

        this.items = [
            ...this.items,
            {
                level: this.levelField.value,
                language,
                file: this.fileField.value
            }
        ];

        this.updateFormAndEmit();

        this.closeModal();
    }

    deleteItem(language: LanguageInterface) {
        this.confirmationService.confirm({
            message: '¿Está seguro de eliminar?',
            header: 'Eliminar',
            icon: PrimeIcons.TRASH,
            rejectButtonStyleClass: 'p-button-text',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'danger',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Eliminar'
            },
            accept: () => {
                this.items = this.items.filter((item) => item.language?.id !== language?.language?.id);

                this.updateFormAndEmit();
            },
            key: 'confirmdialog'
        });
    }

    closeModal() {
        this.isVisibleModal = false;
        this.modalityForm.reset();
    }

    onFileSelect(modality: CatalogueInterface, event: any) {
        const file = event.files?.[0] as File;

        if (!file) return;

        this.fileField.patchValue(file);

        this.responses.set(modality.code!, {
            file,
            modality
        });
    }

    private updateFormAndEmit() {
        this.languagesField.setValue(this.items);
        this.dataOut.emit(this.form.getRawValue());
    }

    // Getter Modality Form
    get languageField(): AbstractControl {
        return this.modalityForm.controls['language'];
    }

    get levelField(): AbstractControl {
        return this.modalityForm.controls['level'];
    }

    get fileField(): AbstractControl {
        return this.modalityForm.controls['file'];
    }

    get motherLanguageField(): AbstractControl {
        return this.modalityForm.controls['motherLanguage'];
    }

    // Getters Form
    get requirementField(): AbstractControl {
        return this.form.controls['requirement'];
    }

    get hasLanguageField(): AbstractControl {
        return this.form.controls['hasLanguage'];
    }

    get languagesField(): AbstractControl {
        return this.form.controls['languages'];
    }
}
