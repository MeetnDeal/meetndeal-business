import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepABasicInfo } from './step-a-basic-info';

describe('StepABasicInfo', () => {
  let component: StepABasicInfo;
  let fixture: ComponentFixture<StepABasicInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepABasicInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepABasicInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
