import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiLoadingStateComponent } from './ui-loading-state.component';

describe('UiLoadingStateComponent', () => {
  let component: UiLoadingStateComponent;
  let fixture: ComponentFixture<UiLoadingStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiLoadingStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UiLoadingStateComponent);
    component = fixture.componentInstance;
  });

  it('renders the label while visible', () => {
    component.visible = true;
    component.label = 'Caricamento';
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Caricamento');
  });
});
