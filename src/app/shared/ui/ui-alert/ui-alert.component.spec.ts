import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiAlertComponent } from './ui-alert.component';

describe('UiAlertComponent', () => {
  let component: UiAlertComponent;
  let fixture: ComponentFixture<UiAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiAlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UiAlertComponent);
    component = fixture.componentInstance;
  });

  it('renders the message when visible', () => {
    component.message = 'Errore';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Errore');
  });
});
