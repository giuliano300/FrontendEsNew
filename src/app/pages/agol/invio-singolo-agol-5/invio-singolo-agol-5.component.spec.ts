import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloAgol5Component } from './invio-singolo-agol-5.component';

describe('InvioSingoloAgol5Component', () => {
  let component: InvioSingoloAgol5Component;
  let fixture: ComponentFixture<InvioSingoloAgol5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloAgol5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloAgol5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
