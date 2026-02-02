import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimeIcons } from 'primeng/api';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { LabelDirective } from '@utils/directives/label.directive';
import { ErrorMessageDirective } from '@utils/directives/error-message.directive';
import { CustomMessageService } from '@/utils/services';

@Component({
  selector: 'app-contact-person',
  imports: [ReactiveFormsModule, FluidModule, InputTextModule, LabelDirective, ErrorMessageDirective],
  templateUrl: './contact-person.component.html',
  styleUrl: './contact-person.component.scss'
})
export class ContactPersonComponent {
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

      ngOnInit() {
          this.loadData();
      }

      buildForm() {
          this.form = this.formBuilder.group({
              name: [ null, Validators.required],
              email: [ null, Validators.required],
              phone : [ null, Validators.required],
              secondaryPhone: [null, Validators.required],
              identification: [null, Validators.required]

          });
          this.watchFormChanges();
      }

      watchFormChanges() {
          this.form.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((_) => {
              if (this.form.valid) {
                  this.dataOut.emit(this.form);
              }
          });
      }

      getFormErrors(): string[] {
          const errors: string[] = [];

          if(this.nameField.invalid) errors.push('Su nombre es obligatorio.');
          if(this.emailField.invalid) errors.push('Su correo electrónico es obligatorio.');
          if(this.phoneField.invalid) errors.push('Su teléfono es obligatorio.');
          if(this.secondaryPhoneField.invalid) errors.push('Su teléfono secundario es obligatorio.');
          if(this.identificationField.invalid) errors.push('Identificación');

          if (errors.length > 0) {
              this.form.markAllAsTouched();
              return errors;
          }

          return [];
      }

      loadData() {}

      get nameField() {
        return this.form.controls['name'];
      }

      get emailField() {
        return this.form.controls['email'];
      }

      get phoneField() {
        return this.form.controls['phone'];
      }

      get secondaryPhoneField() {
        return this.form.controls['secondaryPhone'];
      }

      get identificationField() {
        return this.form.controls['identification'];
      }

}


