import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PaginationInterface } from '@utils/interfaces';
import { ColInterface } from '@utils/interfaces/col.interface';
import { CoreService } from '@utils/services';
import { ListComponent } from '@/utils/components/list/list.component';
import { CadastreDacHttpService } from '@/pages/core/roles/dac/services';

@Component({
    selector: 'app-cadastre-dac-list',
    imports: [ListComponent],
    templateUrl: './cadastre-dac-list.component.html',
    styleUrl: './cadastre-dac-list.component.scss'
})
export class CadastreDacListComponent implements OnInit {
    private readonly cadastreDacHttpService = inject(CadastreDacHttpService);
    private readonly coreService = inject(CoreService);

    items: any[] = [];
    pagination!: PaginationInterface;
    currentSearch: string = '';

    cols: ColInterface[] = [
        { field: 'registerNumber', header: 'Número de Registro' },
        { field: 'registeredAt', header: 'Fecha de Registro', type: 'date' },
        { field: 'systemOrigin', header: 'Sistema de Origen' },
        { field: 'createdAt', header: 'Fecha de Creación', type: 'date' }
    ];

    buttonActions: MenuItem[] = [];

    ngOnInit() {
        this.loadCadastres();
    }

    loadCadastres(page = 1) {
        this.cadastreDacHttpService.getCadastres(page, this.currentSearch).subscribe({
            next: (response: any) => {
                this.items = response.data;
                this.pagination = response.pagination;
                this.pagination.totalItems = 12;
            }
        });
    }

    onSearch(searchTerm: string) {
        this.currentSearch = searchTerm || '';
        this.loadCadastres();
    }

    onPagination(page: number) {
        this.loadCadastres(page);
    }
}
