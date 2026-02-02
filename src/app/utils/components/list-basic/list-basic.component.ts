import { Component, EventEmitter, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { MenuItem, PrimeIcons } from 'primeng/api';
import { Button } from 'primeng/button';
import { ButtonActionComponent } from '@utils/components/button-action/button-action.component';
import { Fluid } from 'primeng/fluid';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { InputText } from 'primeng/inputtext';
import { CoreService } from '@utils/services';
import { ColInterface } from '@utils/interfaces/col.interface';
import { DatePipe } from '@angular/common';
import { FontAwesome } from '@/api/font-awesome';

@Component({
    selector: 'app-list-basic',
    templateUrl: './list-basic.component.html',
    styleUrls: ['./list-basic.component.scss'],
    imports: [Button, ButtonActionComponent, Fluid, IconField, InputIcon, ReactiveFormsModule, TableModule, Tooltip, InputText, DatePipe],
    standalone: true
})
export class ListBasicComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    items = input.required<any[]>();
    cols = input.required<ColInterface[]>();
    buttonActions = input.required<MenuItem[]>();
    title = input.required<string>();
    isButtonActionsEnabled = signal(false);

    onCreate = output<any>();
    onEdit = output<any>();
    onDelete = output<any>();
    onSelect = output<any>();



    protected readonly coreService = inject(CoreService);
    protected selectedItem = new EventEmitter<any>();
    protected globalFilterFields: string[] = [];

    constructor() {}

    ngOnInit(): void {
        this.globalFilterFields = this.cols().map((col) => col.field);
    }

    selectItem(item: any, index: number) {
        this.isButtonActionsEnabled.set(true);
        this.selectedItem = item;
        this.onSelect.emit({ index });
    }

    create() {
        this.onCreate.emit(null);
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value.trim();
        this.dt.filterGlobal(value, 'contains');
    }

    protected readonly FontAwesome = FontAwesome;
}
