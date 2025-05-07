import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiepilogoSpedizioneComponent } from './riepilogo-spedizione.component';

describe('RiepilogoSpedizioneComponent', () => {
  let component: RiepilogoSpedizioneComponent;
  let fixture: ComponentFixture<RiepilogoSpedizioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiepilogoSpedizioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiepilogoSpedizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
