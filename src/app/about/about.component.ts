import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MainHeaderPageComponent } from '../main-header-page/main-header-page.component';
import { CommonModule } from '@angular/common';
import { SeeLatestMoviesComponent } from '../see-latest-movies/see-latest-movies.component';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [MainHeaderPageComponent, CommonModule, SeeLatestMoviesComponent,AnimateOnVisibleDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit {
  // Reference to the stats section in the template
  @ViewChild('statsSection', { static: false }) statsSection!: ElementRef;
  // Array of stats to display (movies, TV shows, people)
  stats = [
    { icon: 'fa-solid fa-clapperboard', label: 'Total Movies', value: 23150, currentValue: 0 },
    { icon: 'fa-solid fa-play', label: 'Total TV Shows', value: 20453, currentValue: 0 },
    { icon: 'fa-solid fa-user', label: 'Total People', value: 30678, currentValue: 0 },
  ];
  ngAfterViewInit(): void {
    // Set up IntersectionObserver to detect when the stats section is visible
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startCounting();  // Start animation when in view
          observer.disconnect(); // Stop observing after the first trigger
        }
      });
    }, { threshold: 0.1 });
    // Start observing the stats section
    if (this.statsSection) {
      observer.observe(this.statsSection.nativeElement);
    }
  }
  // Animate counting from 0 to target value for each stat
  startCounting() {
    this.stats.forEach(stat => {
      const duration = 4000;  // total animation time in ms
      const interval = 20;    // how often to update the number
      const step = Math.ceil(stat.value / (duration / interval)); // step size
      const counter = setInterval(() => {
        stat.currentValue += step;
        if (stat.currentValue >= stat.value) {
          stat.currentValue = stat.value; // cap at max value
          clearInterval(counter);         // stop interval
        }
      }, interval);
    });
  }
}
