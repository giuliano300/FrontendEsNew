import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionSingleWithWithoutBulletinComponent } from './selection-single-with-without-bulletin.component';

describe('SelectionSingleWithWithoutBulletinComponent', () => {
  let component: SelectionSingleWithWithoutBulletinComponent;
  let fixture: ComponentFixture<SelectionSingleWithWithoutBulletinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionSingleWithWithoutBulletinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionSingleWithWithoutBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
