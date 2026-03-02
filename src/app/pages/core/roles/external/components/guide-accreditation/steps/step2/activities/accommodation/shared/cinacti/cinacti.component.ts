import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { MessageModule } from 'primeng/message';
import { CalendarModule } from 'primeng/calendar'; // Para p-calendar
import { InputTextModule } from 'primeng/inputtext'; // Para p-inputText

@Component({
  selector: 'app-cinacti',
  standalone: true,
  imports: [
    Fluid,
    MessageModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule, 
    InputTextModule 
  ],
  templateUrl: './cinacti.component.html',
  styleUrl: './cinacti.component.scss'
})
export class CInactiComponent {
  @Output() dataOut = new EventEmitter<FormGroup>();
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  @Input() form!: FormGroup;
  
    constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.buildForm();
  }

  buildForm(): FormGroup {
    return this.fb.group({
      fecha: [null, Validators.required],
      texto: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]]
    });
  }

  validateForm(): string[] {
    const errors: string[] = [];
    if (this.form.get('fecha')?.invalid) {
      errors.push('La fecha es requerida.');
    }
    if (this.form.get('texto')?.invalid) {
      if (this.form.get('texto')?.errors?.['required']) {
        errors.push('El texto es requerido.');
      }
      if (this.form.get('texto')?.errors?.['minlength']) {
        errors.push('El texto debe tener al menos 3 caracteres.');
      }
      if (this.form.get('texto')?.errors?.['maxlength']) {
        errors.push('El texto no puede tener más de 50 caracteres.');
      }
    }
    return errors;
  }

  get fecha() {
    return this.form.get('fecha');
  }

  get texto() {
    return this.form.get('texto');
  }
}
