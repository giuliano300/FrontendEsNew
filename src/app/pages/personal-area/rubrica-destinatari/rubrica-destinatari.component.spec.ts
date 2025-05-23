import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubricaDestinatariComponent } from './rubrica-destinatari.component';

describe('RubricaDestinatariComponent', () => {
  let component: RubricaDestinatariComponent;
  let fixture: ComponentFixture<RubricaDestinatariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RubricaDestinatariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubricaDestinatariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
