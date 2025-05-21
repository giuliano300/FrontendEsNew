import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompilaBollettinoComponent } from './compila-bollettino.component';

describe('CompilaBollettinoComponent', () => {
  let component: CompilaBollettinoComponent;
  let fixture: ComponentFixture<CompilaBollettinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompilaBollettinoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompilaBollettinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});