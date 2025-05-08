import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploAgol4Component } from './invio-multiplo-agol-4.component';

describe('InvioMultiploAgol4Component', () => {
  let component: InvioMultiploAgol4Component;
  let fixture: ComponentFixture<InvioMultiploAgol4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploAgol4Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploAgol4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
