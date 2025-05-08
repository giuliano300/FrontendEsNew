import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloAgolComponent } from './invio-singolo-agol.component';

describe('InvioSingoloAgolComponent', () => {
  let component: InvioSingoloAgolComponent;
  let fixture: ComponentFixture<InvioSingoloAgolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloAgolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloAgolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
