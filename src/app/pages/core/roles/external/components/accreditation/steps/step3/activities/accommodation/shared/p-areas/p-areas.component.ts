import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Fluid } from 'primeng/fluid';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  standalone: true,
  selector: 'app-p-areas',
  imports: [ToggleSwitchModule, ReactiveFormsModule, Fluid],
  templateUrl: './p-areas.component.html',
  styleUrl: './p-areas.component.scss',
})
export class PAreasComponent implements OnInit {
   @Output() dataOut = new EventEmitter<FormGroup>();
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);
  @Input() form!: FormGroup;

  ngOnInit() {
    this.ensureFormControls();
  }

  ensureFormControls() {
    if (!this.form.contains('checked')) {
      this.form.addControl('checked', this._formBuilder.control(null as boolean | null));
    }
  }

  validateForm(): boolean {
    const checkField = this.form.controls['checked'];
    return checkField.touched ? this.form.valid : false;
  }
}