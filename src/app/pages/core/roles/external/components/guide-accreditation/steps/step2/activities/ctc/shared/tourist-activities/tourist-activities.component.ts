import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { TabsModule } from 'primeng/tabs';
import { PrimeIcons } from 'primeng/api';
import { Fluid } from 'primeng/fluid';
import { Panel } from 'primeng/panel';
import { MessageModule } from 'primeng/message';

import { FoodDrinkComponent } from '../food-drink/food-drink.component';

import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { MultiSelect } from 'primeng/multiselect';
import { AccommodationComponent } from '../accommodation/accommodation.component';
import { CommunityOperationComponent } from '../community-operation/community-operation.component';
import { CatalogueService } from '@utils/services/catalogue.service';
import { CatalogueInterface } from '@utils/interfaces';
import { CatalogueActivitiesCodeEnum, CatalogueTypeEnum } from '@utils/enums';
import { CatalogueCtcActivitiesCodeEnum, CatalogueCtcClassificationsCodeEnum } from '@/pages/core/shared/components/regulation-simulator/enum';
import { TouristTransportCompanyCtcComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/ctc/shared/transport/transport.component';

interface Activity {
    id: string;
    name: string;
    selected: boolean;
}

@Component({
    selector: 'app-tourist-activities',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CheckboxModule, TabsModule, Fluid, FoodDrinkComponent, CommunityOperationComponent, AccommodationComponent, Panel, MessageModule, MultiSelect, TouristTransportCompanyCtcComponent],
    templateUrl: './tourist-activities.component.html',
    styleUrl: './tourist-activities.component.scss'
})
export class TouristActivitiesComponent implements OnInit {
    @Input() data!: string | undefined;
    @Output() dataOut = new EventEmitter<FormGroup>();
    @Output() fieldErrorsOut = new EventEmitter<string[]>();
    @Input() parentForm!: FormGroup;

    @ViewChildren(FoodDrinkComponent) private foodDrinkComponent!: QueryList<FoodDrinkComponent>;
    @ViewChildren(AccommodationComponent) private accommodationComponent!: QueryList<AccommodationComponent>;
    @ViewChildren(CommunityOperationComponent) private communityOperationComponent!: QueryList<CommunityOperationComponent>;
    @ViewChildren(TouristTransportCompanyCtcComponent) private touristTransportCompanyCtcComponent!: QueryList<TouristTransportCompanyCtcComponent>;

    protected readonly PrimeIcons = PrimeIcons;
    protected readonly customMessageService = inject(CustomMessageService);
    private readonly formBuilder = inject(FormBuilder);
    private readonly catalogueService = inject(CatalogueService);
    protected form!: FormGroup;

    protected activities: CatalogueInterface[] = [];

    userSelectedActivities: Activity[] = [];

    tabSelected = 0;

    constructor() {
        this.buildForm();
    }

    ngOnInit(): void {
        this.loadData();
        this.patchParentFormValues();
        this.loadCatalogues();
    }

    buildForm(): void {
        this.form = this.formBuilder.group({
            activities: [[], [Validators.required]],
            foodDrink: [null],
            accommodation: [null],
            communityOperation: [null],
            transport: [null]
        });

        this.watchFormChanges();
    }

    patchParentFormValues(): void {
        if (!this.parentForm) return;

        Object.keys(this.form.controls).forEach((key) => {
            if (this.parentForm.contains(key)) {
                const value = this.parentForm.get(key)?.value;
                if (value !== undefined) {
                    this.form.get(key)?.patchValue(value, { emitEvent: false });
                }
            }
        });
    }

    saveFoodDrinkForm(values: any) {
        this.foodDrinkField.patchValue(values);
    }

    saveAccommodationForm(values: any) {
        this.accommodationField.patchValue(values);
    }

    saveCommunityOperationForm(values: any) {
        this.communityOperationField.patchValue(values);
    }

    saveTouristTransportCompanyForm(values: any) {
        this.transportField.patchValue(values);
    }

    watchFormChanges(): void {
        this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
            // const selectedActivities = value.activities.map((x: any) => x.id);
            // const optionalSections = ['foodDrink', 'accommodation', 'communityOperation', 'touristTransportCompany'];
            //
            // optionalSections.forEach((key) => {
            //     const control = this.form.controls[key];
            //
            //     if (!control) return;
            //
            //     const isSelected = selectedActivities.includes(key);
            //
            //     if (!isSelected) {
            //         control.setValue(null, { emitEvent: false });
            //     }
            // });

            console.log(this.form.value);
            if (this.form.valid) {
                this.dataOut.emit(this.form);
            }
        });

        this.activitiesField.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
            const activities: CatalogueInterface[] = value;

            const existCommunityOperation = activities.some((activity) => activity.code === CatalogueCtcActivitiesCodeEnum.community_operation);
            const existAccommodation = activities.some((activity) => activity.code === CatalogueCtcActivitiesCodeEnum.accommodation);
            const existFoodDrink = activities.some((activity) => activity.code === CatalogueCtcActivitiesCodeEnum.food_drink);
            const existTransport = activities.some((activity) => activity.code === CatalogueCtcActivitiesCodeEnum.transport);

            if (!existCommunityOperation) {
                this.communityOperationField.reset();
            }
            if (!existAccommodation) {
                this.accommodationField.reset();
            }
            if (!existFoodDrink) {
                this.foodDrinkField.reset();
            }
            if (!existTransport) {
                this.transportField.reset();
            }
        });
    }

    getFormErrors(): string[] {
        const errors: string[] = [];
        if (this.activitiesField.invalid) {
            errors.push('Debe seleccionar al menos una actividad turística.');
        }

        if ([...this.foodDrinkComponent.toArray().flatMap((c) => c.getFormErrors())].length > 0) {
            errors.push(...this.foodDrinkComponent.toArray().flatMap((c) => c.getFormErrors()));
        }

        if ([...this.accommodationComponent.toArray().flatMap((c) => c.getFormErrors())].length > 0) {
            errors.push(...this.accommodationComponent.toArray().flatMap((c) => c.getFormErrors()));
        }

        if ([...this.communityOperationComponent.toArray().flatMap((c) => c.getFormErrors())].length > 0) {
            errors.push(...this.communityOperationComponent.toArray().flatMap((c) => c.getFormErrors()));
        }

        if ([...this.touristTransportCompanyCtcComponent.toArray().flatMap((c) => c.getFormErrors())].length > 0) {
            errors.push(...this.touristTransportCompanyCtcComponent.toArray().flatMap((c) => c.getFormErrors()));
        }

        if (errors.length > 0) {
            this.form.markAllAsTouched();
        }

        return errors;
    }

    loadData(): void {
        // const seleccionadas = this.activities.filter(a => a.selected).map(a => a.id);
        // this.activitiesField.setValue(seleccionadas, { emitEvent: false }); todo: metodo reutilizable new activity
    }

    async loadCatalogues() {
        this.activities = await this.catalogueService.findByType(CatalogueTypeEnum.ctc_activities);
    }

    get activitiesField() {
        return this.form.controls['activities'];
    }

    get foodDrinkField() {
        return this.form.controls['foodDrink'];
    }

    get accommodationField() {
        return this.form.controls['accommodation'];
    }

    get communityOperationField() {
        return this.form.controls['communityOperation'];
    }

    get transportField() {
        return this.form.controls['transport'];
    }

    get activitiesAvailable() {
        return this.activities.filter((a) => !this.userSelectedActivities.some((ua) => ua.id === a.id));
    }

    protected readonly CatalogueCtcActivitiesCodeEnum = CatalogueCtcActivitiesCodeEnum;
}
