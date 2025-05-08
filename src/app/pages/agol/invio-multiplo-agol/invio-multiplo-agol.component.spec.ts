import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvioMultiploAgolComponent } from './invio-multiplo-agol.component';

describe('InvioMultiploAgolComponent', () => {
  let component: InvioMultiploAgolComponent;
  let fixture: ComponentFixture<InvioMultiploAgolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvioMultiploAgolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvioMultiploAgolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
