import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErroriNotificatiComponent } from './errori-notificati.component';

describe('ErroriNotificatiComponent', () => {
  let component: ErroriNotificatiComponent;
  let fixture: ComponentFixture<ErroriNotificatiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErroriNotificatiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErroriNotificatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
