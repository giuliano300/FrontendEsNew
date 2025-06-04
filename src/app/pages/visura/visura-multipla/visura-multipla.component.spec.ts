import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuraMultiplaComponent } from './visura-multipla.component';

describe('VisuraMultiplaComponent', () => {
  let component: VisuraMultiplaComponent;
  let fixture: ComponentFixture<VisuraMultiplaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisuraMultiplaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisuraMultiplaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
