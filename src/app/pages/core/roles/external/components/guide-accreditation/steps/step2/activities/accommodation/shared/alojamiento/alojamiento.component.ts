import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Fluid } from 'primeng/fluid';

@Component({
  standalone: true,
  selector: 'app-alojamiento',
  templateUrl: './alojamiento.component.html',
  imports: [
    CommonModule,
    DropdownModule,
    AutoCompleteModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    DialogModule,
    ReactiveFormsModule,
    Fluid
  ],
  styleUrl: './alojamiento.component.scss'
})
export class AlojamientoComponent implements OnInit {
  @Output() dataOut = new EventEmitter<FormGroup>();
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  @Input() form!: FormGroup & {
    controls: {
      activities: FormControl<{ name: string } | null>;
    };
  };
  protected readonly PrimeIcons!: PrimeIcons;

  allActivities: any[] = [
    { name: 'ALIMENTOS Y BEBIDAS' },
    { name: 'ALOJAMIENTO' },
    { name: 'TRANSPORTE TURISTICO' },
    { name: 'PARQUES DE ATRACCIONES ESTABLES' },
    { name: 'ORGANIZADORES DE EVENTOS, CONGRESOS Y CONVENCIONES' },
    { name: 'AGENCIAMIENTO TURISTICO' }
  ];

  filteredActivities: any[] = [...this.allActivities];
  errors: string[] = [];

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    if (!this.form) {
      this.form = this._formBuilder.group({
        activities: new FormControl<{ name: string } | null>(null, Validators.required)
      }) as FormGroup & {
        controls: {
          activities: FormControl<{ name: string } | null>;
        };
      };
    }
  }

  search(event: { query: string }) {
    const query = event.query?.toLowerCase() ?? '';
    this.filteredActivities = this.allActivities.filter(activity =>
      activity.name.toLowerCase().includes(query)
    );
  }

  validateForm() {
    this.errors = [];
    if (this.form.controls['activities'].invalid) {
      this.errors.push('Seleccione una actividad');
    }
    return this.errors.length === 0;
  }

  get activity(): AbstractControl {
    return this.form.controls['activities'];
  }
}