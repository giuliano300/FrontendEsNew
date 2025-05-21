import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivioVisureComponent } from './archivio-visure.component';

describe('ArchivioVisureComponent', () => {
  let component: ArchivioVisureComponent;
  let fixture: ComponentFixture<ArchivioVisureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivioVisureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivioVisureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
