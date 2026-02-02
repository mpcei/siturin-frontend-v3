import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';
import { Panel } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { data, items } from './data';
import { ClassificationInterface } from '@/pages/core/shared/interfaces';
import { ContributorTypeEnum } from '../../enum';

@Component({
    selector: 'app-park',
    imports: [Panel, ToggleSwitchModule, ReactiveFormsModule],
    templateUrl: './park.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParkComponent {
    private readonly fb = inject(FormBuilder);
    public classificationInput = input<ClassificationInterface|null>();
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
