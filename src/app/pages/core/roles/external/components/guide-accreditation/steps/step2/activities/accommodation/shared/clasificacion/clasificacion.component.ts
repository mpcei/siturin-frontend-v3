import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Fluid } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

interface Clasification {
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-clasificacion',
  imports: [
    CommonModule,
    DropdownModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,
    Fluid
  ],
  templateUrl: './clasificacion.component.html',
  styleUrl: './clasificacion.component.scss',
})
export class ClasificacionComponent implements OnInit {
  @Output() dataOut = new EventEmitter<FormGroup>();
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);

  @Input() form: FormGroup | undefined;

  clasification: Clasification[] = [
    { name: 'HOTEL' },
    { name: 'HOSTAL' },
    { name: 'LODGE' },
    { name: 'CAMPAMENTO TURISTICO' },
    { name: 'CASA DE HUESPEDES' },
  ];
  clasifications: Clasification[] = [...this.clasification];

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    if (!this.form) {
      this.form = this._formBuilder.group({
        clasification: new FormControl<string | null>(null, Validators.required),
      });
    }
  }

  validateForm(): string[] {
    const errors: string[] = [];
    if (this.clasificationControl?.invalid) {
      errors.push('Seleccione una clasificación');
    }
    return errors;
  }

  search(event: { query: string }) {
    const query = event.query?.toLowerCase() ?? '';
    this.clasifications = this.clasification.filter((item) =>
      item?.name?.toLowerCase()?.includes(query) ?? false
    );
  }

  get clasificationControl(): FormControl<string | null> {
    return this.form?.get('clasification') as FormControl<string | null>;
  }
}