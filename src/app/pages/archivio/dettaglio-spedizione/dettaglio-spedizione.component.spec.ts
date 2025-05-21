import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DettaglioSpedizioneComponent } from './dettaglio-spedizione.component';

describe('DettaglioSpedizioneComponent', () => {
  let component: DettaglioSpedizioneComponent;
  let fixture: ComponentFixture<DettaglioSpedizioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DettaglioSpedizioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DettaglioSpedizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
