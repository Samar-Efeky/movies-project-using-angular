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
  @Input() category: string = 'popular';
  @Input() mediaType: string = 'movie';
  @Input() title: string = '';

  movies: any[] = [];
  private swiperTimeout: any;

  private moviesSubscription!: Subscription;
  private swiperInstance: any;

  // Use ViewChild to reference the swiper container element
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  constructor(
    private _MoviesService: MoviesService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.moviesSubscription = this._MoviesService
      .getMediaCollection(this.mediaType, this.category, '1')
      .subscribe((res) => {
        this.movies = res.results;
        this.swiperTimeout = setTimeout(() => {
        if (this.movies.length >= 2) {
          this.initSwiper();
        }
      }, 0);
        this.cd.detectChanges(); 
        // force update so ViewChild becomes available
      });
  }

  ngAfterViewInit(): void {
    // Initialize swiper only when movies are present
     this.swiperTimeout = setTimeout(() => {
        if (this.movies.length >= 2) {
          this.initSwiper();
        }
      }, 0);
  }

  initSwiper(): void {
    if (!this.movies || this.movies.length < 2) return;

    // Destroy old swiper if exists
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
      breakpoints: {
        0: { slidesPerView: 1 },
        570: { slidesPerView: 2 },
        830: { slidesPerView: 3 },
        1000: { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
        1300: { slidesPerView: 4 },
        1500: { slidesPerView: Math.min(5, this.movies.length) }
      }
    });

    console.log('Swiper instance initialized ✅');
  }

  ngOnDestroy(): void {
    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }
     if (this.swiperTimeout) {
    clearTimeout(this.swiperTimeout);
  }

    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
      console.log('Swiper destroyed ✅');
    }
  }
}
