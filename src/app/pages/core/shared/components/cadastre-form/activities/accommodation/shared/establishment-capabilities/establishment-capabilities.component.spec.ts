import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstablishmentCapabilitiesComponent } from './establishment-capabilities.component';

describe('EstablishmentCapabilitiesComponent', () => {
  let component: EstablishmentCapabilitiesComponent;
  let fixture: ComponentFixture<EstablishmentCapabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstablishmentCapabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstablishmentCapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
