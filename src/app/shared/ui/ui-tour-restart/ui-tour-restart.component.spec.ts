import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiTourRestartComponent } from './ui-tour-restart.component';

describe('UiTourRestartComponent', () => {
  let component: UiTourRestartComponent;
  let fixture: ComponentFixture<UiTourRestartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTourRestartComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UiTourRestartComponent);
    component = fixture.componentInstance;
  });

  it('emits restart when clicked', () => {
    spyOn(component.restart, 'emit');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.restart.emit).toHaveBeenCalled();
  });
});
