import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloRaccomandata5Component } from './invio-singolo-raccomandata-5.component';

describe('InvioSingoloRaccomandata5Component', () => {
  let component: InvioSingoloRaccomandata5Component;
  let fixture: ComponentFixture<InvioSingoloRaccomandata5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloRaccomandata5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloRaccomandata5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
