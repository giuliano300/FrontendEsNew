import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloAgol3Component } from './invio-singolo-agol-3.component';

describe('InvioSingoloAgol3Component', () => {
  let component: InvioSingoloAgol3Component;
  let fixture: ComponentFixture<InvioSingoloAgol3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloAgol3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloAgol3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
