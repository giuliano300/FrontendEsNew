import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivioSpedizioniComponent } from './archivio-spedizioni.component';

describe('ArchivioSpedizioniComponent', () => {
  let component: ArchivioSpedizioniComponent;
  let fixture: ComponentFixture<ArchivioSpedizioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivioSpedizioniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivioSpedizioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
