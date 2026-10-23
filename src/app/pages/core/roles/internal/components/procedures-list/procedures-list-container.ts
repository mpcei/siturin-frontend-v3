import { Component, OnInit, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { CustomMessageService } from '@/utils/services';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { ButtonActionComponent } from '@/utils/components/button-action/button-action.component';
import { Tag } from 'primeng/tag';
import { ProcceduresHttpService } from '../../services/process-http.service';
import { Dialog } from 'primeng/dialog';
import { DatePicker } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-procedures-list-container',
    imports: [TableModule, Button, ButtonActionComponent, Tag, Dialog, DatePicker, FormsModule,DatePipe],
    templateUrl: './procedures-list-container.html'
})
export class ProceduresListContainerComponent implements OnInit {
    protected items = signal<any[]>([]);
    protected selectedItem: any;
    protected pagination: any = {};
    protected isLoading = signal<boolean>(false);
    protected currentSearch: string = '';
    protected inspectionDate = signal(null);
    protected visible = signal<boolean>(false);

    protected readonly customMessageService = inject(CustomMessageService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly service = inject(ProcceduresHttpService);

    FontAwesome = FontAwesome;
    constructor() {}

    ngOnInit() {
        this.loadData();
    }

    loadData(page = 1) {
        this.isLoading.set(true);
        this.service.getProcessList(page, this.currentSearch).subscribe({
            next: (response: any) => {
                this.items.set(response.data);
                this.pagination = response.pagination;
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    onSelect(item: any) {
        if (!item) {
            this.customMessageService.showError({ summary: 'Error', detail: 'Registro no válido' });
            return;
        }
        this.selectedItem = item;
        this.visible.set(true);
    }

    saveinspectionDate() {
        this.service.updateInspectionDate(this.selectedItem.id, this.inspectionDate()).subscribe({
            next: () => {
                this.loadData();
                this.visible.set(false);
                this.selectedItem = null;
            }
        });
    }
}
