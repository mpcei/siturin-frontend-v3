import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  standalone: true,
  selector: 'app-c-concesion',
  imports: [ToggleSwitchModule, ReactiveFormsModule, FormsModule, Fluid],
  templateUrl: './c-concesion.component.html',
  styleUrl: './c-concesion.component.scss'
})
export class CConcesionComponent {
   @Output() dataOut = new EventEmitter<FormGroup>();
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  @Input() form!: FormGroup;

  ngOnInit() {
    this.ensureFormControls();
  }

  ensureFormControls() {
    if (!this.form.contains('concesion')) {
      this.form.addControl('concesion', this._formBuilder.control(false));
    }
  }

  validateForm(): boolean {
    const checkField = this.checkField;
    return checkField.touched ? this.form.valid : false;
  }

  get checkField(): AbstractControl {
    return this.form.controls['concesion'];
  }
}