import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploLettera2Component } from './invio-multiplo-lettera-2.component';

describe('InvioMultiploLettera2Component', () => {
  let component: InvioMultiploLettera2Component;
  let fixture: ComponentFixture<InvioMultiploLettera2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploLettera2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploLettera2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
