import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploRaccomandata2Component } from './invio-multiplo-raccomandata-2.component';

describe('InvioMultiploRaccomandata2Component', () => {
  let component: InvioMultiploRaccomandata2Component;
  let fixture: ComponentFixture<InvioMultiploRaccomandata2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploRaccomandata2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploRaccomandata2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
