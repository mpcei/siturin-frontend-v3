import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CatastroListComponent } from './catastro-list/catastro-list.component';

@Component({
    selector: 'app-catastro',
    templateUrl: './catastro.component.html',
    styleUrls: ['./catastro.component.scss'],
    imports: [CatastroListComponent]
})
export class CatastroComponent implements OnInit {
    formulario: FormGroup = this.nuevoFormulario;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit(): void {}

    get nuevoFormulario() {
        return this.formBuilder.group({
            fechaRegistro: []
        });
    }
}
