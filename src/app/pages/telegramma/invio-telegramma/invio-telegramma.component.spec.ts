import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioTelegrammaComponent } from './invio-telegramma.component';

describe('InvioTelegrammaComponent', () => {
  let component: InvioTelegrammaComponent;
  let fixture: ComponentFixture<InvioTelegrammaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioTelegrammaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioTelegrammaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
