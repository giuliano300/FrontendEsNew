import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSpedizioneAgolComponent } from './tipo-spedizione-agol.component';

describe('TipoSpedizioneAgolComponent', () => {
  let component: TipoSpedizioneAgolComponent;
  let fixture: ComponentFixture<TipoSpedizioneAgolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoSpedizioneAgolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoSpedizioneAgolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
