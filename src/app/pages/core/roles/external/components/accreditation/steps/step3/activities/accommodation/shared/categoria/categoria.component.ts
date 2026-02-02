import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Fluid } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';

interface Category {
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-categoria',
  imports: [
    CommonModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    InputTextModule,
    Fluid
  ],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent implements OnInit {
   @Output() dataOut = new EventEmitter<FormGroup>();
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);

  @Input() form: FormGroup | undefined;

  category: Category[] = [
    { name: '2 ESTRELLAS' },
    { name: '3 ESTRELLAS' },
    { name: '4 ESTRELLAS' },
    { name: '5 ESTRELLAS' },
  ];
  categories: Category[] = [...this.category];

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    if (!this.form) {
      this.form = this._formBuilder.group({
        category: new FormControl<string | null>(null, Validators.required),
      });
    }
  }

  validateForm(): string[] {
    const errors: string[] = [];
    if (this.categoryControl?.invalid) {
      errors.push('Seleccione una categoría');
    }
    return errors;
  }

  search(event: { query: string }) {
    const query = event.query?.toLowerCase() ?? '';
    this.categories = this.category.filter((item) =>
      item?.name?.toLowerCase()?.includes(query) ?? false
    );
  }

  get categoryControl(): FormControl<string | null> {
    return this.form?.get('category') as FormControl<string | null>;
  }
}