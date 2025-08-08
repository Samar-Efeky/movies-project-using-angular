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
import { slideUp, zoomIn } from '../animations/animations';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
// Declare Swiper from CDN
declare var Swiper: any;

@Component({
    selector: 'app-slider',
    imports: [SeeMorePipe, TimeAgoPipe],
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.css',
    animations: [slideUp, zoomIn]
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() category: string = 'popular';
  @Input() mediaType: string = 'movie';
  @Input() title: string = '';
  movies: any[] = [];
    private moviesSubscription!: Subscription;
  private swiperTimeout: any;
  private swiperInstance: any;
 
  // Use ViewChild to reference the swiper container element
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  constructor(
    private _MediaService: MediaService,
    private cd: ChangeDetectorRef,
    private _Router:Router
  ) {}

  ngOnInit(): void {
    this.moviesSubscription = this._MediaService
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
 trackMedia(index: number, item: any): string {
  const id = item.id || 'no-id';
  const name = item.name || item.title || 'no-name';
  const image = item.profile_path || item.poster_path || 'no-image';

  return `${id}-${name}-${image}-${index}`;
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
  navigation: {
    nextEl: '.custom-next',
    prevEl: '.custom-prev',
  },
      breakpoints: {
        0: { slidesPerView: 2 },
        500: { slidesPerView: 3 },
        700: { slidesPerView: 4 },
        1000: { slidesPerView: 3 },
        1150: { slidesPerView: 4},
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
  // Navigate to media details or person details based on mediaType
   goToMediaDetails(mediaType:string, mediaId:string): void {
      // Navigate to the route with parameters: mediaType , media id
      if(mediaType=='person'){
        this._Router.navigate(['person-details',mediaType, mediaId]);
      }else{
        this._Router.navigate(['media-details',mediaType, mediaId]);
      }
    }
     goToMediaCollection(mediaType:string,category:string): void {
      this._Router.navigate(['media-collection',mediaType, category]);
  }
}
