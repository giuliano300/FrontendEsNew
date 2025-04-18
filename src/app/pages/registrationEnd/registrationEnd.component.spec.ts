import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationEndComponent } from './registrationEnd.component';

describe('NotFoundComponent', () => {
  let component: RegistrationEndComponent;
  let fixture: ComponentFixture<RegistrationEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationEndComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
