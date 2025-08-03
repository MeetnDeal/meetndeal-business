import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDetailsComponent } from './step-c-business-details';

describe('BusinessDetailsComponent', () => {
  let component: BusinessDetailsComponent;
  let fixture: ComponentFixture<BusinessDetailsComponent>;

  beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [BusinessDetailsComponent]
      })
    .compileComponents();

      fixture = TestBed.createComponent(BusinessDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
