import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploAgol3Component } from './invio-multiplo-agol-3.component';

describe('InvioMultiploAgol3Component', () => {
  let component: InvioMultiploAgol3Component;
  let fixture: ComponentFixture<InvioMultiploAgol3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploAgol3Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploAgol3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
