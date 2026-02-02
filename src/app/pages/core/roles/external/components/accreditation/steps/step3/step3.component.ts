import { Component, effect, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Select } from 'primeng/select';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { LabelDirective } from '@utils/directives/label.directive';
import { Message } from 'primeng/message';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { PrimeIcons } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueActivitiesCodeEnum, CatalogueProcessesTypeEnum, CatalogueTypeEnum, CoreEnum } from '@utils/enums';
import { CoreSessionStorageService } from '@utils/services';
import { ActivityInterface, CategoryInterface, ClassificationInterface } from '@modules/core/shared/interfaces';
import { ActivityService } from '@modules/core/shared/services';
import { ProcessI } from '@utils/services/core-session-storage.service';
import { AgencyComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/agency/agency.component';
import { CtcComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/ctc/ctc.component';
import { EventComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/event/event.component';
import { TransportComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/transport/transport.component';
import { ParkComponent } from '@modules/core/roles/external/components/accreditation/steps/step3/activities/park/park.component';
import { FoodDrinkComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/food-drink/food-drink.component';
import { AccommodationComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/accommodation/accommodation.component';

interface CatalogMode {
    code: 'registration' | 'update' | 'reclassification' | 'readmission' | string;
    name?: string;
}

@Component({
    selector: 'app-step3',
    standalone: true,
    imports: [Select, FormsModule, Fluid, ReactiveFormsModule, LabelDirective, Message, ErrorMessageDirective, AgencyComponent, CtcComponent, AccommodationComponent, EventComponent, TransportComponent, ParkComponent, FoodDrinkComponent],
    templateUrl: './step3.component.html',
    styleUrl: './step3.component.scss'
})
export class Step3Component implements OnInit {
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();

    protected readonly PrimeIcons = PrimeIcons;
    private readonly formBuilder = inject(FormBuilder);
    protected form!: FormGroup;
    protected process!: ProcessI;
    protected dataIn!: any;

    private readonly activityService = inject(ActivityService);
    private readonly coreSessionStorageService = inject(CoreSessionStorageService);
    private readonly catalogueService = inject(CatalogueService);

    protected readonly CatalogueActivitiesCodeEnum = CatalogueActivitiesCodeEnum;

    protected geographicAreas: CatalogueInterface[] = [];
    protected activities: ActivityInterface[] = [];
    protected classifications: ClassificationInterface[] = [];
    protected categories: CategoryInterface[] = [];

    constructor() {
        this.buildForm();

        effect(async () => {
            const processSignal = this.coreSessionStorageService.processSignal();

            if (processSignal) {
            }
        });
    }

    async ngOnInit() {
        this.process = await this.coreSessionStorageService.getEncryptedValue(CoreEnum.process);
        await this.loadCatalogues();
        await this.loadActivities();
        await this.watchFormChanges();
        await this.loadData();
    }

    buildForm() {
        this.form = this.formBuilder.group({
            geographicArea: [{ value: null, disabled: true }, [Validators.required]],
            activity: [null, [Validators.required]],
            classification: [null, [Validators.required]],
            category: [null, [Validators.required]]
        });
    }

    async watchFormChanges() {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(async () => {
            if (this.form.valid) {
                await this.coreSessionStorageService.setEncryptedValue(CoreEnum.process, { ...this.form.getRawValue() });
            }
        });

        this.activityField.valueChanges.subscribe(async (activity) => {
            if (activity) {
                if (this.process.type?.code === CatalogueProcessesTypeEnum.registration || this.process.type?.code === CatalogueProcessesTypeEnum.readmission || this.process.type?.code === CatalogueProcessesTypeEnum.new_classification) {
                    this.classificationField.reset();
                    this.categoryField.reset();
                }

                this.classifications = await this.activityService.findClassificationsByActivity(activity.id);
            }
        });

        this.classificationField.valueChanges.subscribe(async (classification) => {
            if (classification) {
                if (
                    this.process.type?.code === CatalogueProcessesTypeEnum.registration ||
                    this.process.type?.code === CatalogueProcessesTypeEnum.readmission ||
                    this.process.type?.code === CatalogueProcessesTypeEnum.new_classification ||
                    this.process.type?.code === CatalogueProcessesTypeEnum.reclassification
                ) {
                    this.categoryField.reset();
                }

                this.categories = await this.activityService.findCategoriesByClassification(classification.id);
            }
        });

        this.categoryField.valueChanges.subscribe(async (category) => {
            if (category) {
                // TODO
            }
        });
    }

    saveForm(mainForm: FormGroup) {
        Object.keys(mainForm.controls).forEach((controlName) => {
            const control = mainForm.get(controlName);
            if (control && !this.form.contains(controlName)) {
                this.form.addControl(controlName, control);
            } else {
                this.form.get(controlName)?.patchValue(control?.value);
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];

        if (this.geographicAreaField.invalid) errors.push('Zona Geográfica es obligatoria.');
        if (this.activityField.invalid) errors.push('Actividad es obligatoria.');
        if (this.classificationField.invalid) errors.push('Clasificación es obligatoria.');
        if (this.categoryField.invalid) errors.push('Categoría es obligatoria.');

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    private enableAll(): void {
        this.activityField.enable();
        this.classificationField.enable();
        this.categoryField.enable();
    }

    private disableAll(): void {
        this.activityField.disable();
        this.classificationField.disable();
        this.categoryField.disable();
    }

    async loadCatalogues() {
        this.geographicAreas = await this.catalogueService.findByType(CatalogueTypeEnum.activities_geographic_area);
    }

    async loadActivities() {
        this.geographicAreaField.patchValue(this.geographicAreas.find((x) => x.code === 'continent'));

        if (this.process.province?.code === '20') {
            this.geographicAreaField.patchValue(this.geographicAreas.find((x) => x.code === 'galapagos'));
        }

        this.activities = await this.activityService.findActivitiesByZone(this.geographicAreaField.getRawValue().id);
    }

    async loadData() {
        switch (this.process.type?.code!) {
            case CatalogueProcessesTypeEnum.update:
                this.form.patchValue(this.process);
                await this.loadActivities();
                this.disableAll();
                break;

            case CatalogueProcessesTypeEnum.reclassification:
                this.form.patchValue(this.process);
                await this.loadActivities();
                this.activityField.disable();
                this.classificationField.reset();
                this.categoryField.reset();
                break;

            case CatalogueProcessesTypeEnum.recategorization:
                this.form.patchValue(this.process);
                await this.loadActivities();
                this.activityField.disable();
                this.classificationField.disable();
                this.categoryField.reset();
                break;

            case CatalogueProcessesTypeEnum.registration:
                this.form.patchValue(this.process);
                break;
        }
    }

    get geographicAreaField(): AbstractControl {
        return this.form.controls['geographicArea'];
    }

    get activityField(): AbstractControl {
        return this.form.controls['activity'];
    }

    get classificationField(): AbstractControl {
        return this.form.controls['classification'];
    }

    get categoryField(): AbstractControl {
        return this.form.controls['category'];
    }
}
