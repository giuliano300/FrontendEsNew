import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioTelegramma3Component } from './invio-telegramma-3.component';

describe('InvioTelegramma3Component', () => {
  let component: InvioTelegramma3Component;
  let fixture: ComponentFixture<InvioTelegramma3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioTelegramma3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioTelegramma3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
