import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSpedizioneComponent } from './tipo-spedizione.component';

describe('TipoSpedizioneComponent', () => {
  let component: TipoSpedizioneComponent;
  let fixture: ComponentFixture<TipoSpedizioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoSpedizioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoSpedizioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
