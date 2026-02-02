import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequirementsComponent } from "../shared/requirements/requirements.component";
import { ButtonModule } from "primeng/button";
import { PrimeIcons } from 'primeng/api';
import { TouristActivitiesComponent } from '@/pages/core/roles/external/components/accreditation/steps/step3/activities/ctc/shared/tourist-activities/tourist-activities.component';

@Component({
  selector: 'app-update',
  imports: [RequirementsComponent, TouristActivitiesComponent, ButtonModule],
  templateUrl: './update.component.html',
  styleUrl: './update.component.scss'
})
export class UpdateComponent {
  mainForm: FormGroup;
  protected readonly PrimeIcons = PrimeIcons;

  storedDataJson = localStorage.getItem('registrationData') ?? '';

  constructor(private formBuilder: FormBuilder) {
    this.mainForm = this.formBuilder.group({});
  }

  ngOnInit(): void {
    this.loadStoredData();
  }

  saveForm(data: FormGroup): void {

    const key = Object.keys(data.controls)[0];
    if (!this.mainForm.contains(key)) {
      this.mainForm.addControl(key, data.get(key)!);
    } else {
      this.mainForm.get(key)?.patchValue(data.get(key)?.value);
    }
  }

  loadStoredData(): void {
    const stored = localStorage.getItem('registrationData');
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.keys(parsed).forEach(key => {
        if (!this.mainForm.contains(key)) {
          this.mainForm.addControl(key, this.formBuilder.control(parsed[key]));
        } else {
          this.mainForm.get(key)?.patchValue(parsed[key]);
        }
      });
    }
  }

  updateProcess(): void {
    console.log('Datos actualizados:', this.mainForm.value);
  }
}
