import { Component, effect, inject, input, OnInit, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Select } from 'primeng/select';
import { Dialog } from 'primeng/dialog';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DpaService } from '@/utils/services';
import { DpaInterface } from '@/utils/interfaces';
import { RoleEnum } from '@/utils/enums';
import { FontAwesome } from '@/pages/public/icons/font-awesome';
import { Tooltip } from 'primeng/tooltip';

@Component({
    selector: 'app-assign-dpa',
    standalone: true,
    imports: [Button, TableModule, Select, Dialog, ToggleSwitch, FormsModule, Tooltip],
    templateUrl: './assign-dpa.html'
})
export class AssignDpaComponent implements OnInit {
    protected dpaServices = inject(DpaService);
    visible = input.required<boolean>();
    user = input<any>(null);
    assignedDpas = input<any[]>([]);

    visibleChange = output<void>();
    onAddDpa = output<string>();
    onRemoveDpa = output<string>();
    onToggleProcess = output<{ dpaId: string; hasProcess: boolean }>();
    onToggleEnabled = output<{ dpaId: string; enabled: boolean }>();

    protected selectedNewDpa = signal<DpaInterface>(null);
    protected selectedProvince = signal<DpaInterface>(null);

    protected cantons = signal<DpaInterface[]>([]);
    protected provinces = signal<DpaInterface[]>([]);
    protected isDac = signal(false);
    FontAwesome=FontAwesome
    constructor() {
        effect(() => {
            const currentUser = this.user();

            if (!currentUser || !currentUser.roles) {
                return;
            }
            this.isDac.set(currentUser.roles.some((role) => role.code === RoleEnum.DAC));
        });
        effect(async () => {
            console.log(this.assignedDpas())
            const province = this.selectedProvince();
            const isDac = this.isDac();

            this.selectedNewDpa.set(null);

            if (!isDac || !province?.id) {
                this.cantons.set([]);
                return;
            }

            const data = await this.dpaServices.findDpaByParentId(province.id);

            this.cantons.set(data || []);
        });
    }
    ngOnInit(): void {
        this.loadDpa();
    }
    closeDialog(): void {
        this.selectedNewDpa.set(null);
        this.visibleChange.emit();
    }

    addDpa(): void {
        const data = this.selectedNewDpa();
        if (data !== null) {
            this.onAddDpa.emit(data.id);
            this.selectedNewDpa.set(null);
        }
    }

    removeDpa(dpaId: string): void {
        this.onRemoveDpa.emit(dpaId);
    }

    toggleProcess(dpaId: string, hasProcess: boolean) {
        this.onToggleProcess.emit({ dpaId, hasProcess });
    }
    toggleEnabled(dpaId: string, enabled: boolean) {
        this.onToggleEnabled.emit({ dpaId, enabled });
    }
    async loadDpa() {
        const dpaData = await this.dpaServices.findProvinces();
        this.provinces.set(dpaData);
    }
}
