import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviiPacchiComponent } from './invii-pacchi.component';

describe('InviiPacchiComponent', () => {
  let component: InviiPacchiComponent;
  let fixture: ComponentFixture<InviiPacchiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviiPacchiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviiPacchiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
