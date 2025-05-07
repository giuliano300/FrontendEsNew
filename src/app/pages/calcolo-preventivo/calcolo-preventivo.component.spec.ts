import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcoloPreventivoComponent } from './calcolo-preventivo.component';

describe('CalcoloPreventivoComponent', () => {
  let component: CalcoloPreventivoComponent;
  let fixture: ComponentFixture<CalcoloPreventivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalcoloPreventivoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcoloPreventivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
