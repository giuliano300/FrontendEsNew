import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioTelegramma2Component } from './invio-telegramma-2.component';

describe('InvioTelegramma2Component', () => {
  let component: InvioTelegramma2Component;
  let fixture: ComponentFixture<InvioTelegramma2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioTelegramma2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioTelegramma2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
