import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { MoviesService } from './../services/movies.service';
import { CommonModule } from '@angular/common';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { Subscription } from 'rxjs';

// Declare Swiper from CDN
declare var Swiper: any;

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, SeeMorePipe, AnimateOnVisibleDirective],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
  // Receive inputs from parent component
  @Input() category: string = 'popular';
  @Input() mediaType: string = 'movie';
  @Input() title: string = '';

  // Array to store fetched movies
  movies: any[] = [];

  // Hold the movies subscription to unsubscribe later
  private moviesSubscription!: Subscription;

  // Store Swiper instance
  private swiperInstance: any;

  constructor(
    private _MoviesService: MoviesService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to movie data from the API
    this.moviesSubscription = this._MoviesService
      .getMediaCollection(this.mediaType, this.category,'1')
      .subscribe((res) => {
        this.movies = res.results;

        // Trigger change detection manually
        this.cd.detectChanges();

        // Initialize Swiper only if there are enough movies
        setTimeout(() => {
          if (this.movies.length >= 2) {
            this.initSwiper();
          }
        }, 0);
      });
  }

  ngAfterViewInit(): void {
    // Backup Swiper initialization after view loads
    setTimeout(() => {
      if (this.movies.length >= 2 && !this.swiperInstance) {
        this.initSwiper();
      }
    }, 0);
  }

  initSwiper(): void {
    // Prevent Swiper if not enough movies
    if (!this.movies || this.movies.length < 2) return;

    // Destroy previous Swiper instance if it exists
    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      console.log('Previous Swiper instance destroyed before reinit ✅');
    }

    // Create a new Swiper instance with responsive options
    new Swiper('.swiper', {
      loop: this.movies.length > 4,
      slidesPerView: Math.min(5, this.movies.length),
      spaceBetween: 20,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        570: {slidesPerView:2},
        830: {slidesPerView:3},
        1000: { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
        1300: { slidesPerView: 4 },
        1500: { slidesPerView: Math.min(5, this.movies.length) }
      }
    });

    // Save the swiper instance safely after initialization
    setTimeout(() => {
      const swiperEl = document.querySelector('.swiper') as any;
      if (swiperEl && swiperEl.swiper) {
        this.swiperInstance = swiperEl.swiper;
        console.log('Swiper instance saved ✅');
      } else {
        console.warn('Swiper instance not found');
      }
    }, 0);
  }

  ngOnDestroy(): void {
    // Unsubscribe from the movie API to avoid memory leaks
    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    // Destroy the Swiper instance when component is destroyed
    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      console.log('Swiper destroyed ✅');
    } else {
      console.warn('No valid Swiper to destroy');
    }
  }
}
