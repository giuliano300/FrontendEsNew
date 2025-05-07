import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloRaccomandata3Component } from './invio-singolo-raccomandata-3.component';

describe('InvioSingoloRaccomandata3Component', () => {
  let component: InvioSingoloRaccomandata3Component;
  let fixture: ComponentFixture<InvioSingoloRaccomandata3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloRaccomandata3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloRaccomandata3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
