import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoSpedizioneLetteraComponent } from './tipo-spedizione-lettera.component';

describe('TipoSpedizioneLetteraComponent', () => {
  let component: TipoSpedizioneLetteraComponent;
  let fixture: ComponentFixture<TipoSpedizioneLetteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoSpedizioneLetteraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoSpedizioneLetteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
