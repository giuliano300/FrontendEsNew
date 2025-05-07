import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionSingleMultipleComponent } from './selection-single-multiple.component';

describe('SelectionSingleMultipleComponent', () => {
  let component: SelectionSingleMultipleComponent;
  let fixture: ComponentFixture<SelectionSingleMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionSingleMultipleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionSingleMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
