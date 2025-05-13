import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoVisuraComponent } from './tipo-visura.component';

describe('TipoVisuraComponent', () => {
  let component: TipoVisuraComponent;
  let fixture: ComponentFixture<TipoVisuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoVisuraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoVisuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
