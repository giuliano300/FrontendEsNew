import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiEmptyStateComponent } from './ui-empty-state.component';

describe('UiEmptyStateComponent', () => {
  let component: UiEmptyStateComponent;
  let fixture: ComponentFixture<UiEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiEmptyStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UiEmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('renders the configured empty message', () => {
    component.message = 'Nessun elemento';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nessun elemento');
  });
});
