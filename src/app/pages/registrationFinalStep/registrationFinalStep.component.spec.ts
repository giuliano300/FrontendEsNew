import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationFinalStepComponent } from './registrationFinalStep.component';

describe('RegistrationComponent', () => {
  let component: RegistrationFinalStepComponent;
  let fixture: ComponentFixture<RegistrationFinalStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationFinalStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationFinalStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
