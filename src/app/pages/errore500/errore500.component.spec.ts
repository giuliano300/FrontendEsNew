import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Errore500Component } from './errore500.component';

describe('NotFoundComponent', () => {
  let component: Errore500Component;
  let fixture: ComponentFixture<Errore500Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Errore500Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Errore500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
