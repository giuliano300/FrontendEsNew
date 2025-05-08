import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloLettera5Component } from './invio-singolo-lettera-5.component';

describe('InvioSingoloLettera5Component', () => {
  let component: InvioSingoloLettera5Component;
  let fixture: ComponentFixture<InvioSingoloLettera5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloLettera5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloLettera5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
