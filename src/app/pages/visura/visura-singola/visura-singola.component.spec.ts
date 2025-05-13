import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuraSingolaComponent } from './visura-singola.component';

describe('VisuraSingolaComponent', () => {
  let component: VisuraSingolaComponent;
  let fixture: ComponentFixture<VisuraSingolaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisuraSingolaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisuraSingolaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
