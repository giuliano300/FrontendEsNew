import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioTelegramma4Component } from './invio-telegramma-4.component';

describe('InvioTelegramma4Component', () => {
  let component: InvioTelegramma4Component;
  let fixture: ComponentFixture<InvioTelegramma4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioTelegramma4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioTelegramma4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
