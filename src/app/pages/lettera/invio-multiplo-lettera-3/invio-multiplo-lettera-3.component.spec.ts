import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploLettera3Component } from './invio-multiplo-lettera-3.component';

describe('InvioMultiploLettera3Component', () => {
  let component: InvioMultiploLettera3Component;
  let fixture: ComponentFixture<InvioMultiploLettera3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploLettera3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploLettera3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
