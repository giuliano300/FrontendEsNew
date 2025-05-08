import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloLetteraComponent } from './invio-singolo-lettera.component';

describe('InvioSingoloLetteraComponent', () => {
  let component: InvioSingoloLetteraComponent;
  let fixture: ComponentFixture<InvioSingoloLetteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloLetteraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloLetteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
