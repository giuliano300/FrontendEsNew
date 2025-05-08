import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploLetteraComponent } from './invio-multiplo-lettera.component';

describe('InvioMultiploLetteraComponent', () => {
  let component: InvioMultiploLetteraComponent;
  let fixture: ComponentFixture<InvioMultiploLetteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploLetteraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploLetteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
