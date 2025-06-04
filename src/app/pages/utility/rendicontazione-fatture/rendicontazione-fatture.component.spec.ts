import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendicontazioneFattureComponent } from './rendicontazione-fatture.component';

describe('RendicontazioneFattureComponent', () => {
  let component: RendicontazioneFattureComponent;
  let fixture: ComponentFixture<RendicontazioneFattureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RendicontazioneFattureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendicontazioneFattureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
