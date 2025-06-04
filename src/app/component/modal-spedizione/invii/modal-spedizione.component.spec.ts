import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSpedizioneComponent } from './modal-spedizione.component';

describe('ModalSpedizioneComponent ', () => {
  let component: ModalSpedizioneComponent ;
  let fixture: ComponentFixture<ModalSpedizioneComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSpedizioneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSpedizioneComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
