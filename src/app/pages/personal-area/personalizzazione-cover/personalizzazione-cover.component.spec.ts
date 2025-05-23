import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizzazioneCoverComponent } from './personalizzazione-cover.component';

describe('PersonalizzazioneCoverComponent', () => {
  let component: PersonalizzazioneCoverComponent;
  let fixture: ComponentFixture<PersonalizzazioneCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalizzazioneCoverComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalizzazioneCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
