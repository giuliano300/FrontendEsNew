import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloLettera3Component } from './invio-singolo-lettera-3.component';

describe('InvioSingoloLettera3Component', () => {
  let component: InvioSingoloLettera3Component;
  let fixture: ComponentFixture<InvioSingoloLettera3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloLettera3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloLettera3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
