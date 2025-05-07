import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioSingoloRaccomandataComponent } from './invio-singolo-raccomandata.component';

describe('InvioSingoloRaccomandataComponent', () => {
  let component: InvioSingoloRaccomandataComponent;
  let fixture: ComponentFixture<InvioSingoloRaccomandataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioSingoloRaccomandataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioSingoloRaccomandataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
