import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprimiPdfComponent } from './comprimi-pdf.component';

describe('ComprimiPdfComponent', () => {
  let component: ComprimiPdfComponent;
  let fixture: ComponentFixture<ComprimiPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprimiPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprimiPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
