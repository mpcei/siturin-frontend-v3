import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  standalone: true,
  selector: 'app-u-suelo',
  imports: [ToggleSwitchModule, ReactiveFormsModule, FormsModule, Fluid],
  templateUrl: './u-suelo.component.html',
  styleUrl: './u-suelo.component.scss'
})
export class USueloComponent implements OnInit {
   @Output() dataOut = new EventEmitter<FormGroup>();
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  @Input() form!: FormGroup;

  ngOnInit() {
    this.ensureFormControls();
  }

  ensureFormControls() {
    if (!this.form.contains('sueloChecked')) {
      this.form.addControl('sueloChecked', this._formBuilder.control(null as boolean | null));
    }
  }

  validateForm(): boolean {
    const checkField = this.checkField;
    return checkField.touched ? this.form.valid : false;
  }

  get checkField(): AbstractControl {
    return this.form.controls['sueloChecked'];
  }
}