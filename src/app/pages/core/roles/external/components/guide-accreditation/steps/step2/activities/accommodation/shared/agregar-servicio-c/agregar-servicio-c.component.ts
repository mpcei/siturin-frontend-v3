import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { Fluid } from 'primeng/fluid';
interface Clasification {
  name: string;
}

@Component({
  standalone: true,
  selector: 'app-agregar-servicio-c',
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    AutoCompleteModule,
    InputNumberModule,
    TableModule,
    ReactiveFormsModule,
    Fluid
  ],
  templateUrl: './agregar-servicio-c.component.html',
  styleUrl: './agregar-servicio-c.component.scss',
})
export class AgregarServicioCComponent implements OnInit {
  @Output() dataOut = new EventEmitter<FormGroup>();
  visible: boolean = false;
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  @Input() form!: FormGroup & {
    controls: {
      autocomplete: FormControl<string | null>;
      number4: FormControl<number | null>;
      check: FormControl<boolean>;
    };
  };
  @Output() tableDataUpdated = new EventEmitter<void>();

  public tableData: any[] = [];
  editingIndex: number | null = null;

  Clasification: Clasification[] = [
    { name: 'Bar' },
    { name: 'Cafeteria' },
    { name: 'Restaurante' },
    { name: 'Salones de eventos' },
  ];
  filteredClasification: Clasification[] = [...this.Clasification];

  ngOnInit() {
    console.log('AgregarServicioCComponent: Initialized');
    this.ensureFormControls();
    console.log('Form controls:', this.form.controls);
    this.form.valueChanges.subscribe(value => {
      console.log('Form value changed:', value);
      console.log('Form valid:', this.form.valid);
      console.log('Autocomplete value:', this.form.controls.autocomplete.value);
      console.log('Autocomplete errors:', this.form.controls.autocomplete.errors);
      console.log('Number4 value:', this.form.controls.number4.value);
      console.log('Number4 errors:', this.form.controls.number4.errors);
      console.log('Check value:', this.form.controls.check.value);
    });
  }

  ensureFormControls() {
    if (!this.form.contains('autocomplete')) {
      this.form.addControl('autocomplete', this._formBuilder.control(null, Validators.required));
    }
    if (!this.form.contains('number4')) {
      this.form.addControl('number4', this._formBuilder.control(null, [Validators.required, Validators.min(0), Validators.max(100)]));
    }
    if (!this.form.contains('check')) {
      this.form.addControl('check', this._formBuilder.control(false, { nonNullable: true }));
    }
  }

  search(event: { query: string }) {
    const query = event.query?.toLowerCase() ?? '';
    this.filteredClasification = query
      ? this.Clasification.filter((clasification) => clasification.name.toLowerCase().includes(query))
      : [...this.Clasification];
    console.log('Filtered suggestions:', this.filteredClasification);
  }

  onSelect(event: any) {
    const selected: Clasification = event.value;
    this.form.controls.autocomplete.setValue(selected.name);
    console.log('Selected autocomplete value:', selected.name);
    this._cdr.detectChanges();
  }

  showDialog() {
    console.log('showDialog called, setting visible to true');
    this.editingIndex = null;
    this.form.patchValue({
      autocomplete: null,
      number4: null,
      check: false,
    });
    this.visible = true;
    console.log('Form state after showDialog:', this.form.value);
    console.log('Form valid after showDialog:', this.form.valid);
    console.log('Visible state:', this.visible);
    this._cdr.detectChanges();
  }

  save() {
    console.log('Save called');
    console.log('Form value:', this.form.value);
    console.log('Control autocomplete:', {
      value: this.form.controls.autocomplete.value,
      valid: this.form.controls.autocomplete.valid,
      errors: this.form.controls.autocomplete.errors,
      touched: this.form.controls.autocomplete.touched
    });
    console.log('Control number4:', {
      value: this.form.controls.number4.value,
      valid: this.form.controls.number4.valid,
      errors: this.form.controls.number4.errors,
      touched: this.form.controls.number4.touched
    });
    const isValid = this.form.controls.autocomplete.valid && this.form.controls.number4.valid;
    if (isValid) {
      const formValue = {
        autocomplete: this.form.controls.autocomplete.value,
        number4: this.form.controls.number4.value,
        check: this.form.controls.check.value,
      };
      console.log('Saving data:', formValue);
      if (this.editingIndex !== null) {
        this.tableData[this.editingIndex] = formValue;
      } else {
        this.tableData = [...this.tableData, formValue];
      }
      console.log('tableData after update:', this.tableData);
      this.visible = false;
      this.form.patchValue({
        autocomplete: null,
        number4: null,
        check: false,
      });
      this.editingIndex = null;
      this.tableDataUpdated.emit(); // Notificar a Dashboard
      this._cdr.detectChanges();
    } else {
      this.form.markAllAsTouched();
      console.log('Form is invalid, marked all as touched');
      this._cdr.detectChanges();
    }
  }

  edit(index: number) {
    console.log('Edit called for index:', index);
    this.editingIndex = index;
    const item = this.tableData[index];
    this.form.patchValue({
      autocomplete: item.autocomplete,
      number4: item.number4,
      check: item.check,
    });
    this.visible = true;
    this.filteredClasification = [...this.Clasification];
    console.log('Form state after edit:', this.form.value);
    console.log('Form valid after edit:', this.form.valid);
    this._cdr.detectChanges();
  }

  delete(index: number) {
    console.log('Delete called for index:', index);
    this.tableData = this.tableData.filter((_, i) => i !== index);
    console.log('Deleted row, tableData:', this.tableData);
    this.tableDataUpdated.emit(); 
    this._cdr.detectChanges();
  }
}