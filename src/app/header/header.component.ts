import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { Subscription } from 'rxjs';
import { MediaService } from '../services/media.service';
import { Router } from '@angular/router';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

declare var Swiper: any;

@Component({
    selector: 'app-header',
    imports: [SeeMorePipe, AnimateOnVisibleDirective],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    animations: [slideDown, slideUp, zoomIn]
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  // Input properties for category and media type (default to 'popular' and 'movie')
  @Input() category: string = 'popular';
  @Input() mediaType: string = 'movie';
  // Movies list to display in the header slider
  movies: any[] = [];

  // To manage the API subscription
  private moviesSubscription!: Subscription;

  // Instance of the Swiper slider
  private swiperInstance: any;

  // Timeout reference to delay swiper initialization
  private swiperInitTimeout: any;

  // Reference to the swiper container element in the template
  @ViewChild('swiperCont', { static: false }) swiperContRef!: ElementRef;

  constructor(private _MediaService: MediaService,
    private _Router:Router
  ) {}

  ngOnInit(): void {
    // Fetch media data when component initializes
    this.moviesSubscription = this._MediaService
      .getMediaCollection(this.mediaType, this.category, '1')
      .subscribe((res) => {
        this.movies = res.results;
        this.initSwiperWithDelay(); // Initialize swiper after data is ready
      });
  }

  ngAfterViewInit(): void {
    // Ensure swiper is initialized after the view is loaded
    this.initSwiperWithDelay();
  }
   trackMedia(index: number, item: any): string {
  const id = item.id || 'no-id';
  const name = item.name || item.title || 'no-name';
  const image = item.profile_path || item.poster_path || 'no-image';

  return `${id}-${name}-${image}-${index}`;
}
  // Delay swiper init to make sure DOM is fully rendered
  initSwiperWithDelay() {
    if (this.swiperInitTimeout) clearTimeout(this.swiperInitTimeout);

    this.swiperInitTimeout = setTimeout(() => {
      if (this.movies.length >= 1) {
        this.initSwiper();
      }
    }, 500); // 500ms delay to ensure DOM is ready
  }

  // Initialize the Swiper slider
  initSwiper() {
    if (!this.swiperContRef) return;

    // Destroy existing instance to avoid duplication
    if (this.swiperInstance?.destroy && typeof this.swiperInstance.destroy === 'function') {
      try {
        this.swiperInstance.destroy(true, true);
      } catch (e) {
        console.warn('Swiper destroy error:', e);
      }
      this.swiperInstance = null;
    }

    // Create new Swiper instance
    this.swiperInstance = new Swiper(this.swiperContRef.nativeElement, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 40,
      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
    });
  }
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
  ngOnDestroy(): void {
    // Unsubscribe from API calls to avoid memory leaks
    if (this.moviesSubscription) {
      this.moviesSubscription.unsubscribe();
    }

    // Clear any pending timeouts
    if (this.swiperInitTimeout) {
      clearTimeout(this.swiperInitTimeout);
      this.swiperInitTimeout = null;
    }

    // Clean up Swiper instance on component destroy
    if (this.swiperInstance?.destroy && typeof this.swiperInstance.destroy === 'function') {
      try {
        this.swiperInstance.destroy(true, true);
      } catch (e) {
        console.warn('Swiper destroy error:', e);
      }
      this.swiperInstance = null;
    }
  }
}
