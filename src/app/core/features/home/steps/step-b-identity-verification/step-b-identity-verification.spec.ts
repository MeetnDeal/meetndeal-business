import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepBIdentityVerificationComponent } from './step-b-identity-verification';

describe('StepBIdentityVerificationComponent', () => {
  let component: StepBIdentityVerificationComponent;
  let fixture: ComponentFixture<StepBIdentityVerificationComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StepBIdentityVerificationComponent]
      })
    .compileComponents();

      fixture = TestBed.createComponent(StepBIdentityVerificationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
