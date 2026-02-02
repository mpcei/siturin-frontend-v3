import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { InputNumberModule } from 'primeng/inputnumber';
import { Fluid } from 'primeng/fluid';
import { PrimeIcons } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { Panel } from 'primeng/panel';

@Component({
  selector: 'app-foodDrink',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    Fluid,
    MessageModule,
    LabelDirective,
    ErrorMessageDirective,
    Panel
  ],
  templateUrl: './foodDrink.component.html',
  styleUrl: './foodDrink.component.scss'
})
export class FoodDrinkComponent implements OnInit, OnChanges {
  @Input() data!: string | undefined;  
  @Output() dataOut = new EventEmitter<FormGroup>();
  @Output() fieldErrorsOut = new EventEmitter<string[]>();

  protected readonly PrimeIcons = PrimeIcons;
  private readonly formBuilder = inject(FormBuilder);
  protected readonly customMessageService = inject(CustomMessageService);

  protected form!: FormGroup;

  constructor() {
    this.buildForm();
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      try {
        const parsed = JSON.parse(this.data);
        this.form.patchValue(parsed);
      } catch (error) {
        console.warn('Error parsing input data in FoodDrinkComponent:', error);
      }
    }
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      totalTables: [null, Validators.required],
      totalCapacities: [null, Validators.required]
    });

    this.watchFormChanges();
  }

  watchFormChanges(): void {
    this.form.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        if (this.form.valid) {
          this.dataOut.emit(this.form.value);
        }
      });
  }

  getFormErrors(): string[] {
    const errors: string[] = [];

    if (this.totalTablesField.invalid) errors.push('Número de mesas');
    if (this.totalCapacitiesField.invalid) errors.push('Capacidad en número de personas');

    if (errors.length > 0) {
      this.form.markAllAsTouched();
      return errors;
    }

    return [];
  }

  loadData(): void {
  }

  // Getters
  get totalTablesField(): AbstractControl {
    return this.form.controls['totalTables'];
  }

  get totalCapacitiesField(): AbstractControl {
    return this.form.controls['totalCapacities'];
  }
}
