import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, AbstractControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  standalone: true,
  selector: 'app-scomplementarios',
  imports: [ToggleSwitchModule, ReactiveFormsModule, FormsModule, Fluid],
  templateUrl: './scomplementarios.component.html',
  styleUrl: './scomplementarios.component.scss'
})
export class SComplementariosComponent {
   @Output() dataOut = new EventEmitter<FormGroup>();
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  @Input() form!: FormGroup;

  ngOnInit() {
    console.log('SComplementariosComponent: Initialized');
    this.ensureFormControls();
  }

  ensureFormControls() {
    if (!this.form.contains('complementarios')) {
      this.form.addControl('complementarios', this._formBuilder.control(null, Validators.required));
    }
  }

  validateForm(): boolean {
    const checkField = this.checkField;
    return checkField.touched ? this.form.valid : false;
  }

  get checkField(): AbstractControl {
    return this.form.controls['complementarios'];
  }
}