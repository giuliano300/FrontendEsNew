import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCsvMultiploComponent } from './upload-csv-multiplo.component';

describe('UploadCsvMultiploComponent', () => {
  let component: UploadCsvMultiploComponent;
  let fixture: ComponentFixture<UploadCsvMultiploComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadCsvMultiploComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadCsvMultiploComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
