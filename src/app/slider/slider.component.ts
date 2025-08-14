import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';

import { SeeMorePipe } from '../pipes/see-more.pipe';
import { Subscription } from 'rxjs';
import { MediaService } from '../services/media.service';
import { Router } from '@angular/router';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

// Declare Swiper from CDN
declare var Swiper: any;

@Component({
  selector: 'app-slider',
  imports: [SeeMorePipe, TimeAgoPipe, AnimateOnVisibleDirective],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  animations:[slideDown, slideUp, zoomIn]
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() category: string = 'popular';
  @Input() mediaType: string = 'movie';
  @Input() title: string = '';

  movies: any[] = [];
  private moviesSubscription!: Subscription;

  private swiperTimeout: any;
  private swiperInstance: any;

  private dataLoaded = false;
  private viewInitialized = false;

  // Reference to the swiper container in the template
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  constructor(
    private _MediaService: MediaService,
    private cd: ChangeDetectorRef,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to media data from service
    this.moviesSubscription = this._MediaService
      .getMediaCollection(this.mediaType, this.category, '1')
      .subscribe((res) => {
        this.movies = res.results;
        this.dataLoaded = true;
        this.tryInitSwiper();

        // Force Angular to check for view updates (because data changed)
        this.cd.detectChanges();
      });
  }

  ngAfterViewInit(): void {
    // Mark view as initialized
    this.viewInitialized = true;
    this.tryInitSwiper();
  }

  // Try to initialize swiper only when data loaded and view initialized
  private tryInitSwiper(): void {
    if (this.dataLoaded && this.viewInitialized && this.movies.length >= 2) {
      if (this.swiperTimeout) clearTimeout(this.swiperTimeout);

      this.swiperTimeout = setTimeout(() => {
        this.initSwiper();
      }, 0);
    }
  }

  // Initialize Swiper instance
  initSwiper(): void {
    if (!this.movies || this.movies.length < 2) return;

    // Destroy old swiper instance if exists to avoid duplicates
    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }

    this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
      loop: this.movies.length > 4,
      slidesPerView: Math.min(5, this.movies.length),
      spaceBetween: 20,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false
      },
      navigation: {
        nextEl: '.custom-next',
        prevEl: '.custom-prev',
      },
      breakpoints: {
        0: { slidesPerView: 2 },
        500: { slidesPerView: 3 },
        700: { slidesPerView: 4 },
        1000: { slidesPerView: 3 },
        1150: { slidesPerView: 4 },
        1500: { slidesPerView: Math.min(5, this.movies.length) }
      }
    });
  }

  // Track function for ngFor to optimize rendering
  trackMedia(index: number, item: any): string {
    const id = item.id || 'no-id';
    const name = item.name || item.title || 'no-name';
    const image = item.profile_path || item.poster_path || 'no-image';

    return `${id}-${name}-${image}-${index}`;
  }

  // Navigate to media or person details page
  goToMediaDetails(mediaType: string, mediaId: string): void {
    if (mediaType === 'person') {
      this._Router.navigate(['person-details', mediaType, mediaId]);
    } else {
      this._Router.navigate(['media-details', mediaType, mediaId]);
    }
  }

  // Navigate to full media collection page
  goToMediaCollection(mediaType: string, category: string): void {
    this._Router.navigate(['media-collection', mediaType, category]);
  }

  ngOnDestroy(): void {
    // Unsubscribe from media subscription to avoid memory leaks
    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    // Clear any pending timeouts
    if (this.swiperTimeout) {
      clearTimeout(this.swiperTimeout);
    }

    // Destroy swiper instance to free resources
    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }
}
