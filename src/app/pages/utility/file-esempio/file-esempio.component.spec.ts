import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileEsempioComponent } from './file-esempio.component';

describe('FileEsempioComponent', () => {
  let component: FileEsempioComponent;
  let fixture: ComponentFixture<FileEsempioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileEsempioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileEsempioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
