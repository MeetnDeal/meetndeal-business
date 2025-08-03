import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepABasicInfoComponent } from './step-a-basic-info';

describe('StepABasicInfoComponent', () => {
  let component: StepABasicInfoComponent;
  let fixture: ComponentFixture<StepABasicInfoComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [StepABasicInfoComponent]
      })
    .compileComponents();

      fixture = TestBed.createComponent(StepABasicInfoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
