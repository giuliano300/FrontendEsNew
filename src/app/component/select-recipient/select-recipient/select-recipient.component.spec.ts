import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectRecipientComponent } from './select-recipient.component';

describe('SelectRecipientComponent', () => {
  let component: SelectRecipientComponent;
  let fixture: ComponentFixture<SelectRecipientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectRecipientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
