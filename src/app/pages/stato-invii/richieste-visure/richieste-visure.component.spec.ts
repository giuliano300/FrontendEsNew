import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichiesteVisureComponent } from './richieste-visure.component';

describe('RichiesteVisureComponent', () => {
  let component: RichiesteVisureComponent;
  let fixture: ComponentFixture<RichiesteVisureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichiesteVisureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RichiesteVisureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
