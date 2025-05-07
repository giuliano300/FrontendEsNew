import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploRaccomandataComponent } from './invio-multiplo-raccomandata.component';

describe('InvioMultiploRaccomandataComponent', () => {
  let component: InvioMultiploRaccomandataComponent;
  let fixture: ComponentFixture<InvioMultiploRaccomandataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploRaccomandataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploRaccomandataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
