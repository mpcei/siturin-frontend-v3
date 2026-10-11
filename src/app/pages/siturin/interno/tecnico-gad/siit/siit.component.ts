import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-siit',
    templateUrl: './siit.component.html',
    styleUrls: ['./siit.component.scss']
})
export class SiitComponent implements OnInit {
    form: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        this.form = this.newForm;
    }

    ngOnInit(): void {}

    get newForm() {
        return this.formBuilder.group({ ruc: [] });
    }
}
