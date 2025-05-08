import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloAgol4Component } from './invio-singolo-agol-4.component';

describe('InvioSingoloAgol4Component', () => {
  let component: InvioSingoloAgol4Component;
  let fixture: ComponentFixture<InvioSingoloAgol4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloAgol4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloAgol4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
