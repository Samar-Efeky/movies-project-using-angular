import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainHeaderPageComponent } from '../main-header-page/main-header-page.component';
import { SeeLatestMoviesComponent } from '../see-latest-movies/see-latest-movies.component';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
// Interface for each statistic item
interface StatItem {
  icon: string;
  label: string;
  value: number;
  currentValue: number;
  visible: boolean; // Whether the stat card is visible on screen
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    MainHeaderPageComponent,
    SeeLatestMoviesComponent,
    AnimateOnVisibleDirective
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  animations: [slideDown, slideUp, zoomIn]
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  // References to each stat card element
  @ViewChildren('statCard') statCards!: QueryList<ElementRef>;
  // List of statistics with icon, label, and counting values
  stats: StatItem[] = [
    { icon: 'fa-solid fa-clapperboard', label: 'Total Movies', value: 23150, currentValue: 0, visible: false },
    { icon: 'fa-solid fa-play', label: 'Total TV Shows', value: 20453, currentValue: 0, visible: false },
    { icon: 'fa-solid fa-user', label: 'Total People', value: 30678, currentValue: 0, visible: false }
  ];

  // IntersectionObserver to track when cards are in viewport
  private observer!: IntersectionObserver;
  // Store active interval IDs to clear them later
  private intervals: any[] = [];

  ngAfterViewInit(): void {
    // Create an IntersectionObserver to detect when each stat card becomes visible
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          // Find index of the visible stat card
          const index = this.statCards.toArray().findIndex(card => card.nativeElement === entry.target);
          // Start counting only once when the card first appears
          if (entry.isIntersecting && index !== -1 && !this.stats[index].visible) {
            this.stats[index].visible = true;
            this.startCounting(index);
            // Stop observing this card after triggering
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 } // 50% of the card must be visible
    );

    // Observe all stat cards
    this.statCards.forEach(card => {
      this.observer.observe(card.nativeElement);
    });
  }

  // Increment numbers for a specific stat item until reaching its final value
  startCounting(index: number) {
    const stat = this.stats[index];
    const duration = 4000; // Total animation duration (ms)
    const intervalTime = 20; // Update interval (ms)
    const step = Math.ceil(stat.value / (duration / intervalTime)); // Increment per step

    const counter = setInterval(() => {
      stat.currentValue += step;
      if (stat.currentValue >= stat.value) {
        stat.currentValue = stat.value; // Ensure it doesn't go over the target
        clearInterval(counter);
      }
    }, intervalTime);

    // Keep track of active intervals for cleanup
    this.intervals.push(counter);
  }

  ngOnDestroy(): void {
    // Disconnect the observer to prevent memory leaks
    if (this.observer) {
      this.observer.disconnect();
    }
    // Clear all intervals to prevent ongoing timers after component is destroyed
    this.intervals.forEach(id => clearInterval(id));
  }
}
