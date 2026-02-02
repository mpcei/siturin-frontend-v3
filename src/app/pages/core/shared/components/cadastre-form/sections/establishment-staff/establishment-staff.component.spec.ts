import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentStaffComponent } from './establishment-staff.component';

describe('EstablishmentStaffComponent', () => {
  let component: EstablishmentStaffComponent;
  let fixture: ComponentFixture<EstablishmentStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstablishmentStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstablishmentStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
