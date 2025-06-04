import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnionePdfComponent } from './unione-pdf.component';

describe('UnionePdfComponent', () => {
  let component: UnionePdfComponent;
  let fixture: ComponentFixture<UnionePdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnionePdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnionePdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
