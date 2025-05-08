import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloLettera4Component } from './invio-singolo-lettera-4.component';

describe('InvioSingoloLettera4Component', () => {
  let component: InvioSingoloLettera4Component;
  let fixture: ComponentFixture<InvioSingoloLettera4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloLettera4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloLettera4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
