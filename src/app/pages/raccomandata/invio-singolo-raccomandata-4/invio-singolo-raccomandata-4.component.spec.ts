import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloRaccomandata4Component } from './invio-singolo-raccomandata-4.component';

describe('InvioSingoloRaccomandata4Component', () => {
  let component: InvioSingoloRaccomandata4Component;
  let fixture: ComponentFixture<InvioSingoloRaccomandata4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloRaccomandata4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloRaccomandata4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
