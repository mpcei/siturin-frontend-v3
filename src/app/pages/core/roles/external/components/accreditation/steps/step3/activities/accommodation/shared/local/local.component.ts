import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { Fluid } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-local',
  imports: [CommonModule,
    DropdownModule,
    AutoCompleteModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ReactiveFormsModule,
  Fluid],
  templateUrl: './local.component.html',
  styleUrl: './local.component.scss'
})
export class LocalComponent {
   @Output() dataOut = new EventEmitter<FormGroup>();
private readonly _formBuilder: FormBuilder = inject(FormBuilder);

@Input() form!: FormGroup & { controls: { local: FormControl<string | null> } };

  local: any[] = [ 
    { name: 'Arrendado' },
    { name: 'Cedido' },
    { name: 'Propio' },
  ];
locals: any[] = [...this.local];

constructor() {
    this.buildForm();
  }

buildForm() {
  if (!this.form) {
      this.form = this._formBuilder.group({
        local: new FormControl<string | null>(null, Validators.required),
      });
    }
  }

  validateForm(): string[] {
    const errors: string[] = [];
    if (this.form.controls['local'].invalid) {
      errors.push('Seleccione un local');
    }
    return errors;
  }

  search(event: { query: string }) {
    const query = event.query?.toLowerCase() ?? '';
    if (!query) {
    
      this.locals = [...this.local];
    } else {
    
      this.locals = this.local.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }
    console.log('Filtered suggestions:', this.locals);
  }

get localControl(): FormControl<string | null> {
  return this.form.controls.local as FormControl<string | null>;
  }
}
