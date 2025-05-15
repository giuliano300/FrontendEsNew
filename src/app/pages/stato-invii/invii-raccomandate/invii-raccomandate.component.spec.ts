import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviiRaccomandateComponent } from './invii-raccomandate.component';

describe('InviiRaccomandateComponent', () => {
  let component: InviiRaccomandateComponent;
  let fixture: ComponentFixture<InviiRaccomandateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviiRaccomandateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviiRaccomandateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
