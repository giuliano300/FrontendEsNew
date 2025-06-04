import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampaUnioneComponent } from './stampa-unione.component';

describe('StampaUnioneComponent', () => {
  let component: StampaUnioneComponent;
  let fixture: ComponentFixture<StampaUnioneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StampaUnioneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StampaUnioneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
