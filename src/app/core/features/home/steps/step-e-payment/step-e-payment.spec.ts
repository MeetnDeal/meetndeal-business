import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepEPaymentComponent } from './step-e-payment';

describe('StepEPaymentComponent', () => {
  let component: StepEPaymentComponent;
  let fixture: ComponentFixture<StepEPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepEPaymentComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StepEPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
