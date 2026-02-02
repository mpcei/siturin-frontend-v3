import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroundLocalsComponent } from './ground-locals.component';

describe('GroundLocalsComponent', () => {
  let component: GroundLocalsComponent;
  let fixture: ComponentFixture<GroundLocalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroundLocalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroundLocalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
