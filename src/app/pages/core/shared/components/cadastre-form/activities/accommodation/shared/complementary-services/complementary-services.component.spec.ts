import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplementaryServicesComponent } from './complementary-services.component';

describe('ComplementaryServicesComponent', () => {
  let component: ComplementaryServicesComponent;
  let fixture: ComponentFixture<ComplementaryServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplementaryServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplementaryServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
