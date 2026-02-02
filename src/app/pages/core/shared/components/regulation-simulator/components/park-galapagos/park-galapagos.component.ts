import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { HeaderRegulation, Item } from '../../../../interfaces/item.interface';
import { Panel } from 'primeng/panel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { data, items } from './data';

@Component({
    selector: 'app-park-galapagos',
    imports: [Panel, ToggleSwitchModule, ReactiveFormsModule],
    templateUrl: './park-galapagos.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParkGalapagosComponent {
    itemForm!: FormGroup;
    private readonly fb = inject(FormBuilder);
    public classificationInput = input();
    protected classification = signal<HeaderRegulation | null>(null);
    form!: FormGroup;

    buildForm = effect(() => {
        if (!this.classificationInput()) return;

        this.classification.set(data.find((item) => item.codeClassification === this.classificationInput()) ?? null);


        this.form = this.fb.group({
            items: this.fb.array(items.map((item) => this.createItemGroup(item)))
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
