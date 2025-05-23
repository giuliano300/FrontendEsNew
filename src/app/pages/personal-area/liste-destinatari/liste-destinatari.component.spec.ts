import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDestinatariComponent } from './liste-destinatari.component';

describe('ListeDestinatariComponent', () => {
  let component: ListeDestinatariComponent;
  let fixture: ComponentFixture<ListeDestinatariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeDestinatariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeDestinatariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
