import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviiTelegrammiComponent } from './invii-telegrammi.component';

describe('InviiTelegrammiComponent', () => {
  let component: InviiTelegrammiComponent;
  let fixture: ComponentFixture<InviiTelegrammiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviiTelegrammiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviiTelegrammiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
