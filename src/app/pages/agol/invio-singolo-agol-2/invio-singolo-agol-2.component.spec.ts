import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloAgol2Component } from './invio-singolo-agol-2.component';

describe('InvioSingoloAgol2Component', () => {
  let component: InvioSingoloAgol2Component;
  let fixture: ComponentFixture<InvioSingoloAgol2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloAgol2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloAgol2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
