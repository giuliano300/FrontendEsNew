import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuraSingola3Component } from './visura-singola-3.component';

describe('VisuraSingola3Component', () => {
  let component: VisuraSingola3Component;
  let fixture: ComponentFixture<VisuraSingola3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisuraSingola3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisuraSingola3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
