import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBIdentityVerification } from './step-b-identity-verification';

describe('StepBIdentityVerification', () => {
  let component: StepBIdentityVerification;
  let fixture: ComponentFixture<StepBIdentityVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepBIdentityVerification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepBIdentityVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
