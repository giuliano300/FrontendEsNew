import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSpedizioniComponent } from './report-spedizioni.component';

describe('ReportSpedizioniComponent', () => {
  let component: ReportSpedizioniComponent;
  let fixture: ComponentFixture<ReportSpedizioniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSpedizioniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSpedizioniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
