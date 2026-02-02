import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { data, items } from './data';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';
import { ContributorTypeEnum } from '../../enum';
import { Message } from 'primeng/message';
import { LabelDirective } from '@utils/directives/label.directive';

@Component({
    selector: 'app-food-drink-continent',
    imports: [ReactiveFormsModule, ToggleSwitchModule, Message, LabelDirective],
    templateUrl: './food-drink-continent.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FoodDrinkContinentComponent {
    private readonly fb = inject(FormBuilder);
    public classificationInput = input<ClassificationInterface | null>();
    public contributorType = input.required<ContributorTypeEnum>();
    protected classification = signal<HeaderRegulation | null>(null);
    form!: FormGroup;

    buildForm = effect(() => {
        if (!this.classificationInput()) return;

        this.classification.set(data.find((item) => item.codeClassification === this.classificationInput()?.code) ?? null);

        const validatedItems = items.filter((item) => item.person === this.contributorType() || item.person === ContributorTypeEnum.both);

        this.form = this.fb.group({
            items: this.fb.array(validatedItems.map((item) => this.createItemGroup(item)))
        });
    });

    createItemGroup(item: Item): FormGroup {
        return this.fb.group({
            name: [item.label],
            isCompliant: [false]
        });
    }

    onSubmit() {}

    get itemsField(): FormArray {
        return this.form.get('items') as FormArray;
    }
}
