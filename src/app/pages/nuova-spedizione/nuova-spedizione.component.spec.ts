import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovaSpedizioneComponent } from './nuova-spedizione.component';

describe('NuovaSpedizioneComponent', () => {
  let component: NuovaSpedizioneComponent;
  let fixture: ComponentFixture<NuovaSpedizioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuovaSpedizioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuovaSpedizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
