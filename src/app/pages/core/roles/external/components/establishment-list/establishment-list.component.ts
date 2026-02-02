import { Component, inject, OnInit } from '@angular/core';
import { Message } from 'primeng/message';
import { Fluid } from 'primeng/fluid';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { BreadcrumbService } from '@layout/service';
import { TableModule } from 'primeng/table';
import { EstablishmentInterface } from '@modules/core/shared/interfaces';
import { EstablishmentHttpService } from '@modules/core/roles/external/services';

@Component({
    selector: 'app-establishment-list',
    imports: [Message, Fluid, ReactiveFormsModule, TableModule],
    templateUrl: './establishment-list.component.html',
    styleUrl: './establishment-list.component.scss'
})
export class EstablishmentListComponent implements OnInit {
    protected readonly PrimeIcons = PrimeIcons;
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly establishmentHttpService = inject(EstablishmentHttpService);

    protected establishments: EstablishmentInterface[] = [];

    constructor() {
        this.breadcrumbService.setItems([{ label: 'Proceso de Acreditación de Actividades Turísticas' }]);
    }

    ngOnInit(): void {
        this.findAll();
    }

    findAll(page = 1, search = null) {
        this.establishmentHttpService.findAll(page, search).subscribe({
            next: (result) => {
                this.establishments = result.data;
                console.log(result);
            }
        });
    }
}
