import { Injectable } from '@angular/core';
import { ShepherdService } from 'angular-shepherd';
import { TourSeenService } from './tourSeen.service';

type TourSteps = Parameters<ShepherdService['addSteps']>[0];

@Injectable({ providedIn: 'root' })
export class AppTourService {
  constructor(
    private shepherdService: ShepherdService,
    private tourSeenService: TourSeenService
  ) {}

  start(page: number, steps: TourSteps): void {
    this.shepherdService.modal = true;
    this.shepherdService.defaultStepOptions = {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shepherd-theme-arrows'
    };

    this.shepherdService.addSteps(steps);

    setTimeout(() => {
      this.shepherdService.start();
      this.shepherdService.tourObject?.on('complete', () => {
        this.tourSeenService.markSeen(page);
      });
    }, 300);
  }

  startIfUnseen(page: number, startTour: () => void): void {
    if (!this.tourSeenService.hasSeen(page)) {
      startTour();
    }
  }
}
