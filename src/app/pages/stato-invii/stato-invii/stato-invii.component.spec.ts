import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatoInviiComponent } from './stato-invii.component';

describe('StatoInviiComponent', () => {
  let component: StatoInviiComponent;
  let fixture: ComponentFixture<StatoInviiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatoInviiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatoInviiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
