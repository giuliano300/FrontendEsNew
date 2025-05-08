import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploAgol2Component } from './invio-multiplo-agol-2.component';

describe('InvioMultiploAgol2Component', () => {
  let component: InvioMultiploAgol2Component;
  let fixture: ComponentFixture<InvioMultiploAgol2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploAgol2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploAgol2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
