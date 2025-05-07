import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloRaccomandata2Component } from './invio-singolo-raccomandata-2.component';

describe('InvioSingoloRaccomandata2Component', () => {
  let component: InvioSingoloRaccomandata2Component;
  let fixture: ComponentFixture<InvioSingoloRaccomandata2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloRaccomandata2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloRaccomandata2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
