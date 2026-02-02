import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PrimeIcons } from 'primeng/api';
import { Fluid } from 'primeng/fluid';
import { CustomMessageService } from '@utils/services/custom-message.service';

@Component({
  selector: 'app-accommodation',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    CheckboxModule,
    Fluid
],
  templateUrl: './accommodation.component.html',
  styleUrl: './accommodation.component.scss'
})
export class AccommodationComponent implements OnInit{
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
    this.loadData()
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      totalRooms: [null, Validators.required],
      totalBeds: [null, Validators.required],
      totalPlaces: [null, Validators.required]
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

    if (this.totalRoomsField.invalid) errors.push('Debe indicar el número de habitaciones.');
    if (this.totalBedsField.invalid) errors.push('Debe indicar el número de camas.');
    if (this.totalPlacesField.invalid) errors.push('Debe indicar el número de plazas.');

    if (errors.length > 0) {
      this.form.markAllAsTouched();
      return errors;
    }

    return [];
  }

  loadData(): void {
  }

  // Getters
  get totalRoomsField(): AbstractControl {
    return this.form.controls['totalRooms'];
  }

  get totalBedsField(): AbstractControl {
    return this.form.controls['totalBeds'];
  }

  get totalPlacesField(): AbstractControl {
    return this.form.controls['totalPlaces'];
  }
}
