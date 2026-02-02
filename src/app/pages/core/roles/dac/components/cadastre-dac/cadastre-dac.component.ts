import { Component } from '@angular/core';
import { CadastreDacListComponent } from '@/pages/core/roles/dac/components/cadastre-dac-list/cadastre-dac-list.component';
import { CadastreFormComponent } from '@/pages/core/shared/components/cadastre-form/cadastre-form.component';

@Component({
    selector: 'app-cadastre-dac',
    imports: [CadastreDacListComponent, CadastreFormComponent],
    templateUrl: './cadastre-dac.component.html',
    styleUrl: './cadastre-dac.component.scss'
})
export class CadastreDacComponent {}
