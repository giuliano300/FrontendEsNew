import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuraSingola2Component } from './visura-singola-2.component';

describe('VisuraSingola2Component', () => {
  let component: VisuraSingola2Component;
  let fixture: ComponentFixture<VisuraSingola2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisuraSingola2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisuraSingola2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
