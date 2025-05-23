import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSpedizioniBollettiniComponent } from './report-spedizioni-bollettini.component';

describe('ReportSpedizioniBollettiniComponent', () => {
  let component: ReportSpedizioniBollettiniComponent;
  let fixture: ComponentFixture<ReportSpedizioniBollettiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSpedizioniBollettiniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSpedizioniBollettiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
