import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/api';
import { Fluid } from 'primeng/fluid';
import { Input } from '@angular/core';

interface Room {
  name: string;
}

@Component({
  selector: 'app-a-habitacion',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    ButtonModule,
    AutoCompleteModule,
    InputNumberModule,
    TableModule,
    SharedModule,
    Fluid
  ],
  templateUrl: './a-habitacion.component.html',
  styleUrl: './a-habitacion.component.scss'
})
export class AHabitacionComponent implements OnInit {
  @Output() dataOut = new EventEmitter<FormGroup>();
  visible = false;
 @Input() form: FormGroup;
  tableData: any[] = [];
  allRooms: Room[] = [
    { name: 'Individual o simple' },
    { name: 'Doble' },
    { name: 'Triple' }
  ];
  filteredRooms: Room[] = [...this.allRooms];
  editingIndex: number | null = null;

  private readonly _formBuilder = inject(FormBuilder);

  constructor() {
    this.form = this._formBuilder.group({
      autocomplete: [null, Validators.required],
      number1: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      number2: [null],
      number3: [null],
      check: [false, { nonNullable: true }]
    });
  }

  ngOnInit() {
    console.log('Form initialized:', this.form.value);
  }

  showDialog() {
    this.editingIndex = null;
    this.form.reset();
    this.filteredRooms = [...this.allRooms];
    this.visible = true;
  }

  setVisible(value: boolean) {
    this.visible = value;
    if (!value) {
      this.form.reset();
      this.editingIndex = null;
    }
  }

  save() {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.editingIndex !== null) {
        this.tableData[this.editingIndex] = formValue;
      } else {
        this.tableData.push(formValue);
      }
      this.setVisible(false);
    } else {
      this.form.markAllAsTouched();
    }
  }

  search(event: { query: string }) {
    this.filteredRooms = this.allRooms.filter(room =>
      room.name.toLowerCase().includes(event.query.toLowerCase())
    );
  }

 
  onRoomSelect(event: any) {
    const room: Room = event.value;
    this.autocompleteControl.setValue(room?.name || null);
    console.log('Room selected:', room, 'set autocomplete to:', this.autocompleteControl.value);
  }

  edit(index: number) {
    this.editingIndex = index;
    this.form.patchValue(this.tableData[index]);
    this.visible = true;
  }

  delete(index: number) {
    this.tableData = this.tableData.filter((_, i) => i !== index);
  }

  get autocompleteControl(): FormControl<string | null> {
    return this.form.get('autocomplete') as FormControl<string | null>;
  }

  get number1Control(): FormControl<number | null> {
    return this.form.get('number1') as FormControl<number | null>;
  }

  get number2Control(): FormControl<number | null> {
    return this.form.get('number2') as FormControl<number | null>;
  }

  get number3Control(): FormControl<number | null> {
    return this.form.get('number3') as FormControl<number | null>;
  }

  get checkControl(): FormControl<boolean> {
    return this.form.get('check') as FormControl<boolean>;
  }
}