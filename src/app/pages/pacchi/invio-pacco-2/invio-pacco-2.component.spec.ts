import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioPacco2Component } from './invio-pacco-2.component';

describe('InvioPacco2Component', () => {
  let component: InvioPacco2Component;
  let fixture: ComponentFixture<InvioPacco2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioPacco2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioPacco2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
