import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviiAgolComponent } from './invii-agol.component';

describe('InviiAgolComponent', () => {
  let component: InviiAgolComponent;
  let fixture: ComponentFixture<InviiAgolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviiAgolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviiAgolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
