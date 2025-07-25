import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { MoviesService } from '../services/movies.service';
import { CommonModule } from '@angular/common';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { Subscription } from 'rxjs';

declare var Swiper: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AnimateOnVisibleDirective, CommonModule, SeeMorePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() category: string = 'popular'; // Category of movies to fetch
  @Input() mediaType: string = 'movie';  // Type of media (movie, tv, etc.)

  movies: any[] = []; // Array to store fetched movies
  private moviesSubscription!: Subscription; // Subscription to API call
  private swiperInstance: any; // Swiper instance reference
  private swiperInitTimeout: any; // Timeout for delaying swiper initialization

  constructor(private _MoviesService: MoviesService) {}

  ngOnInit(): void {
    // Subscribe to movie API and fetch data
    this.moviesSubscription = this._MoviesService
      .getMovies(this.mediaType, this.category)
      .subscribe((res) => {
        this.movies = res.results;
        this.initSwiperWithDelay(); // Initialize swiper after data is ready
      });
  }

  ngAfterViewInit(): void {
    this.initSwiperWithDelay(); // Extra check in case data is already available
  }

  initSwiperWithDelay() {
    // Clear any previous timeout before setting a new one
    if (this.swiperInitTimeout) clearTimeout(this.swiperInitTimeout);
    this.swiperInitTimeout = setTimeout(() => {
      if (this.movies.length >= 1) {
        this.initSwiper(); // Initialize Swiper only if there are movies
      }
    }, 500);
  }

  initSwiper() {
    // Destroy previous Swiper instance before creating a new one
    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
    }

    // Create new Swiper instance
    this.swiperInstance = new Swiper('.mySwiper1', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 40,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false
      },
    });

    console.log('✅ Header Swiper initialized');
  }

  ngOnDestroy(): void {
    // Unsubscribe from movie API to prevent memory leaks
    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    // Clear any pending Swiper initialization timeout
    if (this.swiperInitTimeout) {
      clearTimeout(this.swiperInitTimeout);
      console.log('🕓 Swiper init timeout cleared');
    }

    // Destroy Swiper instance if it exists
    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
      console.log('🗑️ Header Swiper destroyed');
    }
  }
}
