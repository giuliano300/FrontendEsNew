import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloLettera2Component } from './invio-singolo-lettera-2.component';

describe('InvioSingoloLettera2Component', () => {
  let component: InvioSingoloLettera2Component;
  let fixture: ComponentFixture<InvioSingoloLettera2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloLettera2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloLettera2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
