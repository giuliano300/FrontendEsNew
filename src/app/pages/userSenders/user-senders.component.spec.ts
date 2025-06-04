import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSendersComponent } from './user-senders.component';

describe('UserSendersComponent', () => {
  let component: UserSendersComponent;
  let fixture: ComponentFixture<UserSendersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserSendersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSendersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
