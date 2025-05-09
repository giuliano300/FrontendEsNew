import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap, Power4 } from 'gsap';


@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

    ngAfterViewInit(): void {
    gsap.to(".fade-in", {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.3,
      ease: Power4.easeOut
    });

    gsap.to(".text-reveal", {
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      y: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: Power4.easeOut
    });
  }



}
