import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription, take } from 'rxjs';
import { MediaDetailsService } from '../services/media-details.service';
import { MainHeaderPageComponent } from '../main-header-page/main-header-page.component';
import { DatePipe } from '@angular/common';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { ProfileService } from '../services/profile-service';
import { UserService } from '../services/user-service';
// Declare Swiper from CDN
declare var Swiper: any;

@Component({
  selector: 'app-person-profile',
  imports: [
    MainHeaderPageComponent,
    DatePipe,
    SeeMorePipe,
    TimeAgoPipe,
    AnimateOnVisibleDirective
  ],
  templateUrl: './person-profile.component.html',
  styleUrl: './person-profile.component.css',
  animations: [slideUp, zoomIn, slideDown]
})
export class PersonProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  /** UI visibility flags */
  overviewVisible = false;
  showFullBiography = false;
  showAllImages = false;

  /** Data holders */
  type!: string;
  id!: string;
  personDetails: any = null;
  personImages: any[] = [];
  visibleImages: any[] = [];
  personCredits: any[] = [];

  /** Swiper visibility control */
  visibleItems: { [key: number]: boolean } = {};

  /** Swiper instance and timeout */
  private swiperInstance: any;
  private swiperTimeout: any;

  /** Subscriptions */
  private routeSub!: Subscription;
  private dataSub!: Subscription; // NEW: store forkJoin subscription to avoid memory leak
  uid: string = '';

  /** ViewChild to access swiper container in template */
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  constructor(
    private _MediaDetailsService: MediaDetailsService,
    private route: ActivatedRoute,
    private _Router: Router,
    private cd: ChangeDetectorRef,
    private profileService: ProfileService,
    private userService: UserService
  ) {}

  /** OnInit: fetch data when route params change */
  ngOnInit(): void {
    // Get current logged in user once
    this.userService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.uid = user.uid;
      }
    });

    // Subscribe to route changes
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.type = params.get('mediaType') || '';
      this.id = params.get('mediaId') || '';

      // Fetch person details, images, and credits in parallel
      this.dataSub = forkJoin({
        details: this._MediaDetailsService.getMediaDetails(this.type, this.id),
        images: this._MediaDetailsService.getMostDetails(this.type, this.id, 'images'),
        personCredits: this._MediaDetailsService.getMostDetails(this.type, this.id, 'combined_credits'),
      }).subscribe({
        next: ({ details, images, personCredits }) => {
          this.personDetails = details;

          // Add to history if user logged in
          if (this.uid && this.personDetails) {
            this.addToHistory();
          }

          // Setup images
          this.personImages = images.profiles || [];
          this.visibleImages = this.personImages.slice(0, 10);

          // Setup credits
          this.personCredits = personCredits.cast || [];

          // Initialize swiper if enough items
          this.swiperTimeout = setTimeout(() => {
            if (this.personCredits.length >= 2) {
              this.initSwiper();
              this.cd.detectChanges();
            }
          }, 0);
        }
      });
    });
  }

  /** TrackBy function for images */
  trackByFn(index: number, item: any): any {
    return item.file_path || index;
  }

  /** TrackBy function for media credits */
  trackMediaPerson(index: number, item: any): string {
    return `${item.credit_id || item.id || index}-${item.media_type}`;
  }

  /** AfterViewInit: init swiper if already have data */
  ngAfterViewInit(): void {
    this.swiperTimeout = setTimeout(() => {
      if (this.personCredits.length >= 2) {
        this.initSwiper();
      }
    }, 0);
  }

  /** Clean up to prevent memory leaks */
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe(); // Unsubscribe from route changes
    this.dataSub?.unsubscribe();  // Unsubscribe from forkJoin HTTP requests

    if (this.swiperTimeout) {
      clearTimeout(this.swiperTimeout);
    }

    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }

  /** Toggle biography text */
  toggleBiography(): void {
    this.showFullBiography = !this.showFullBiography;
  }

  /** Show "See More" link if biography is long */
  shouldShowToggle(bio: string): boolean {
    return bio?.split(" ").length > 40;
  }

  /** Toggle between showing all images or first 10 */
  toggleImagesView(): void {
    this.showAllImages = !this.showAllImages;
    this.visibleImages = this.showAllImages
      ? this.personImages
      : this.personImages.slice(0, 10);
  }

  /** Initialize swiper with responsive settings */
  private initSwiper(): void {
    if (!this.personCredits || this.personCredits.length < 2) return;

    // Destroy old instance if exists
    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }

    const slidesToShow = Math.min(5, this.personCredits.length);
    this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
      loop: this.personCredits.length > slidesToShow,
      slidesPerView: slidesToShow,
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
        1500: { slidesPerView: Math.min(5, this.personCredits.length) }
      }
    });
  }

  /** Navigate to media or person details */
  goToMediaDetails(mediaType: string, mediaId: string): void {
    if (mediaType === 'person') {
      this._Router.navigate(['person-details', mediaType, mediaId]);
    } else {
      this._Router.navigate(['media-details', mediaType, mediaId]);
    }
  }

  /** Add person to user's history */
  private addToHistory(): void {
    if (!this.uid) return;
    this.profileService.addToHistory(this.uid, {
      id: this.personDetails.id,
      title: this.personDetails.name,
      imageUrl: this.personDetails.profile_path
        ? 'https://image.tmdb.org/t/p/w500/' + this.personDetails.profile_path
        : '',
      type: 'person',
    });
  }
}
