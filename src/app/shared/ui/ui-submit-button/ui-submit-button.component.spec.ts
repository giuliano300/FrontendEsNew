import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiSubmitButtonComponent } from './ui-submit-button.component';

describe('UiSubmitButtonComponent', () => {
  let component: UiSubmitButtonComponent;
  let fixture: ComponentFixture<UiSubmitButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSubmitButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UiSubmitButtonComponent);
    component = fixture.componentInstance;
  });

  it('disables the button while loading', () => {
    component.loading = true;
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.disabled).toBeTrue();
  });
});
