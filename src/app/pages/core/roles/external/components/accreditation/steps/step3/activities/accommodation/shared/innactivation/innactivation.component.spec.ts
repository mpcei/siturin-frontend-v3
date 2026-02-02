import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnactivationComponent } from './innactivation.component';

describe('InnactivationComponent', () => {
  let component: InnactivationComponent;
  let fixture: ComponentFixture<InnactivationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnactivationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnactivationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
