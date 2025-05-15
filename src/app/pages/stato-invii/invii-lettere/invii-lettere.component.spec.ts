import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviiLettereComponent } from './invii-lettere.component';

describe('InviiLettereComponent', () => {
  let component: InviiLettereComponent;
  let fixture: ComponentFixture<InviiLettereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviiLettereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviiLettereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
