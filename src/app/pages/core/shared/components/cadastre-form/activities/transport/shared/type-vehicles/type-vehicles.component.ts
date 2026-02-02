import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfirmationService, MenuItem, PrimeIcons } from 'primeng/api';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { ColInterface } from '@utils/interfaces';
import { Message } from "primeng/message";
import { DatePicker } from "primeng/datepicker";
import { LabelDirective } from '@/utils/directives/label.directive';
import { ErrorMessageDirective } from '@/utils/directives/error-message.directive';
import { FluidModule } from 'primeng/fluid';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Dialog } from "primeng/dialog";
import { ListBasicComponent } from "@/utils/components/list-basic/list-basic.component";
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

interface LandTransportInterface {
  type: string;
  plate: string;
  registration: string;
  capacity: number;
  registrationAt: Date | null;
  registrationExpirationAt: Date | null;
  certifiedCode: string;
  certifiedIssueAt: Date | null;
  certifiedExpirationAt: Date | null;
}

@Component({
  selector: 'app-type-vehicles',
  templateUrl: './type-vehicles.component.html',
  styleUrls: ['./type-vehicles.component.scss'],
  imports: [Message, ButtonModule,DatePicker, ListBasicComponent, InputTextModule,SelectModule ,LabelDirective, ErrorMessageDirective, FluidModule, ReactiveFormsModule, ToggleButtonModule, Dialog, ListBasicComponent, InputNumberModule],
})
export class TypeVehiclesComponent implements OnInit {
  @Input() data!: string | undefined;
  @Output() dataOut = new EventEmitter<FormGroup>();

  private readonly formBuilder = inject(FormBuilder);
  protected readonly customMessageService = inject(CustomMessageService);
  private confirmationService = inject(ConfirmationService);
  protected readonly PrimeIcons = PrimeIcons;

  protected form!: FormGroup;
  protected landTransportTypeForm!: FormGroup;
  protected buttonActions: MenuItem[] = [];

  protected isVisibleModal = false;
  protected cols: ColInterface[] = [];
  protected items: LandTransportInterface[] = [];

  ngOnInit(): void {
    this.buildForm();
    this.buildColumns();
  }

  buildForm(): void {
    this.landTransportTypeForm = this.formBuilder.group({
      type: ["null", Validators.required],
      plate: [null, [Validators.required, Validators.maxLength(20)]],
      registration: [null, Validators.required],
      capacity: [null, [Validators.required, Validators.min(1)]],
      registrationAt: [null, Validators.required],
      registrationExpirationAt: [null, Validators.required],
      certifiedCode: [null, Validators.required],
      certifiedIssueAt: [null, Validators.required],
      certifiedExpirationAt: [null, Validators.required]
    });

    this.form = this.formBuilder.group({
      hasLandTransports: [false],
      landTransportTypes: [[]],
    });
  }

  buildColumns(): void {
    this.cols = [
      { field: 'type', header: 'Tipo' },
      { field: 'plate', header: 'Placa' },
      { field: 'registration', header: 'Formulario Matrícula' },
      { field: 'capacity', header: 'Capacidad' },
      { field: 'registrationAt', header: 'Fecha de emisión' },
      { field: 'registrationExpirationAt', header: 'Fecha de caducidad' },
      { field: 'certifiedCode', header: 'Código de Certificación' },
      { field: 'certifiedIssueAt', header: 'Fecha de Emisión' },
      { field: 'certifiedExpirationAt', header: 'Fecha de Expiración' }
    ];
  }


  getFormErrors(): string[] {
    const errors: string[] = [];

    if (this.typeField.invalid) errors.push('Tipo');
    if (this.plateField.invalid) errors.push('Placa');
    if (this.registrationField.invalid) errors.push('Formulario Matrícula');
    if (this.capacityField.invalid) errors.push('Capacidad');
    if (this.registrationAtField.invalid) errors.push('Fecha de emisión');
    if (this.registrationExpirationAtField.invalid) errors.push('Fecha de caducidad');
    if (this.certifiedCodeField.invalid) errors.push('Código de Certificación');
    if (this.certifiedIssueAtField.invalid) errors.push('Fecha de Emisión');
    if (this.certifiedExpirationAtField.invalid) errors.push('Fecha de Expiración');

    if (errors.length > 0) {
      this.landTransportTypeForm.markAllAsTouched();
      this.customMessageService.showFormErrors(errors);
    }

    return errors;
  }

  create(): void {
    this.landTransportTypeForm.reset();
    this.isVisibleModal = true;
  }

  closeModal(): void {
    this.isVisibleModal = false;
  }

  onSubmit(): void {
    this.hasLandTransportsField.setValue(true);

    if (this.getFormErrors()) {
      this.createLandTransportType();
    }
  }

  createLandTransportType(): void {
    this.hasLandTransportsField.setValue(true);

    this.items.push(this.landTransportTypeForm.value);

    this.closeModal();

    this.landTransportTypesField.setValue(this.items);

    this.dataOut.emit(this.form);
  }

  editLandTransport(item: LandTransportInterface): void {
    this.landTransportTypeForm.patchValue(item);
    this.isVisibleModal = true;
  }

  deleteLandTransport(item: LandTransportInterface): void {
    this.confirmationService.confirm({
      message: '¿Está seguro de eliminar?',
      header: 'Eliminar',
      icon: this.PrimeIcons.TRASH,
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.items = this.items.filter(i => i !== item);
        this.landTransportTypesField.setValue(this.items);
        this.dataOut.emit(this.form);
      },
    });
  }

  get hasLandTransportsField(): AbstractControl {
    return this.form.controls['hasLandTransports'];
  }

  get landTransportTypesField(): AbstractControl {
    return this.form.controls['landTransportTypes'];
  }

  get typeField(): AbstractControl {
    return this.landTransportTypeForm.controls['type'];
  }

  get plateField(): AbstractControl {
    return this.landTransportTypeForm.controls['plate'];
  }

  get registrationField(): AbstractControl {
    return this.landTransportTypeForm.controls['registration'];
  }

  get capacityField(): AbstractControl {
    return this.landTransportTypeForm.controls['capacity'];
  }

  get registrationAtField(): AbstractControl {
    return this.landTransportTypeForm.controls['registrationAt'];
  }

  get registrationExpirationAtField(): AbstractControl {
    return this.landTransportTypeForm.controls['registrationExpirationAt'];
  }

  get certifiedCodeField(): AbstractControl {
    return this.landTransportTypeForm.controls['certifiedCode'];
  }

  get certifiedIssueAtField(): AbstractControl {
    return this.landTransportTypeForm.controls['certifiedIssueAt'];
  }

  get certifiedExpirationAtField(): AbstractControl {
    return this.landTransportTypeForm.controls['certifiedExpirationAt'];
  }
}
