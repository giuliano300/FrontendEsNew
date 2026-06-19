import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSpedizioneRaccomandataComponent } from './tipo-spedizione.component';

describe('TipoSpedizioneRaccomandataComponent', () => {
  let component: TipoSpedizioneRaccomandataComponent;
  let fixture: ComponentFixture<TipoSpedizioneRaccomandataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoSpedizioneRaccomandataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoSpedizioneRaccomandataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
