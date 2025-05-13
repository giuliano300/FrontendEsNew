import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioPaccoComponent } from './invio-pacco.component';

describe('InvioPaccoComponent', () => {
  let component: InvioPaccoComponent;
  let fixture: ComponentFixture<InvioPaccoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioPaccoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioPaccoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
