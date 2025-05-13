import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuraMultipla2Component } from './visura-multipla-2.component';

describe('VisuraMultipla2Component', () => {
  let component: VisuraMultipla2Component;
  let fixture: ComponentFixture<VisuraMultipla2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisuraMultipla2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisuraMultipla2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
