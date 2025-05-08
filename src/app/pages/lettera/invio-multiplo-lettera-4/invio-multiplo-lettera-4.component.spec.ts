import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploLettera4Component } from './invio-multiplo-lettera-4.component';

describe('InvioMultiploLettera4Component', () => {
  let component: InvioMultiploLettera4Component;
  let fixture: ComponentFixture<InvioMultiploLettera4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploLettera4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploLettera4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
