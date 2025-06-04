import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SincBipiolComponent } from './sinc-bipiol.component';

describe('SincBipiolComponent', () => {
  let component: SincBipiolComponent;
  let fixture: ComponentFixture<SincBipiolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SincBipiolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SincBipiolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
