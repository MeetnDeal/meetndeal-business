import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepCBusinessDetails } from './step-c-business-details';

describe('StepCBusinessDetails', () => {
  let component: StepCBusinessDetails;
  let fixture: ComponentFixture<StepCBusinessDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepCBusinessDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepCBusinessDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
