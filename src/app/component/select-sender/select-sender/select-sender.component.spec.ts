import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSenderComponent } from './select-sender.component';

describe('SelectSenderComponent', () => {
  let component: SelectSenderComponent;
  let fixture: ComponentFixture<SelectSenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
