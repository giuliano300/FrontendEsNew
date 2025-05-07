import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploRaccomandata3Component } from './invio-multiplo-raccomandata-3.component';

describe('InvioMultiploRaccomandata3Component', () => {
  let component: InvioMultiploRaccomandata3Component;
  let fixture: ComponentFixture<InvioMultiploRaccomandata3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploRaccomandata3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploRaccomandata3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
