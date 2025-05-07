import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploRaccomandata4Component } from './invio-multiplo-raccomandata-4.component';

describe('InvioMultiploRaccomandata4Component', () => {
  let component: InvioMultiploRaccomandata4Component;
  let fixture: ComponentFixture<InvioMultiploRaccomandata4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploRaccomandata4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploRaccomandata4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
