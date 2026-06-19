import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionWithWithoutBulletinComponent } from './selection-with-without-bulletin.component';

describe('SelectionWithWithoutBulletinComponent', () => {
  let component: SelectionWithWithoutBulletinComponent;
  let fixture: ComponentFixture<SelectionWithWithoutBulletinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionWithWithoutBulletinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionWithWithoutBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
