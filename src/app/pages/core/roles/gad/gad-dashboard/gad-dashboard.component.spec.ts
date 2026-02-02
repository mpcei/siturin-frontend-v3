import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GadDashboardComponent } from './gad-dashboard.component';

describe('GadDashboardComponent', () => {
  let component: GadDashboardComponent;
  let fixture: ComponentFixture<GadDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GadDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GadDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
