import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription, switchMap, take } from 'rxjs';
import { MediaDetailsService } from '../services/media-details.service';
import { MainHeaderPageComponent } from '../main-header-page/main-header-page.component';
import { DatePipe, CommonModule } from '@angular/common';
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
    imports: [MainHeaderPageComponent, DatePipe, CommonModule, SeeMorePipe, TimeAgoPipe, AnimateOnVisibleDirective],
    templateUrl: './person-profile.component.html',
    styleUrl: './person-profile.component.css',
    animations: [slideUp, zoomIn, slideDown]
})
export class PersonProfileComponent implements OnInit, AfterViewInit, OnDestroy {

  /** UI Visibility flags */
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

  /** Control swiper visibility and animations */
  visibleItems: { [key: number]: boolean } = {};

  /** Swiper control */
  private swiperInstance: any;
  private swiperTimeout: any;

  /** Route subscription */
  private sub!: Subscription;
 uid: string = '';
  /** Access to swiper container in template */
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  constructor(
    private _MediaDetailsService: MediaDetailsService,
    private route: ActivatedRoute,
    private _Router: Router,
    private cd: ChangeDetectorRef,
     private profileService: ProfileService,
        private userService: UserService
  ) {}

  /** OnInit: fetch data when route parameters change */
  ngOnInit(): void {
      this.userService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.uid = user.uid;
      }
    });
    this.sub = this.route.paramMap.subscribe(params => {
      this.type = params.get('mediaType') || '';
      this.id = params.get('mediaId') || '';

      // Fetch person details, images, and credits in parallel
      forkJoin({
        details: this._MediaDetailsService.getMediaDetails(this.type, this.id),
        images: this._MediaDetailsService.getMostDetails(this.type, this.id, 'images'),
        personCredits: this._MediaDetailsService.getMostDetails(this.type, this.id, 'combined_credits'),
      }).subscribe({
        next: ({ details, images, personCredits }) => {
          this.personDetails = details;
           if (this.uid && this.personDetails) {
            this.addToHistory();
        }
          this.personImages = images.profiles || [];
          this.visibleImages = this.personImages.slice(0, 10); // Show first 10 images
          this.personCredits = personCredits.cast || [];

          // Initialize swiper if enough credits exist
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
  trackByFn(index: number, item: any): any {
    return item.file_path || index;
}
trackMediaPerson(index: number, item: any): string {
  return `${item.credit_id || item.id || index}-${item.media_type}`;
}

  /** AfterViewInit: initialize swiper if data already available */
  ngAfterViewInit(): void {
    this.swiperTimeout = setTimeout(() => {
      if (this.personCredits.length >= 2) {
        this.initSwiper();
      }
    }, 0);
  }

  /** Clean up subscriptions, timers, and swiper instance */
  ngOnDestroy(): void {
    this.sub?.unsubscribe();

    if (this.swiperTimeout) {
      clearTimeout(this.swiperTimeout);
    }

    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
      console.log('Swiper destroyed ✅');
    }
  }

  /** Toggle full/short biography */
  toggleBiography(): void {
    this.showFullBiography = !this.showFullBiography;
  }

  /** Check if biography is long enough to toggle display */
  shouldShowToggle(bio: string): boolean {
    return bio?.split(" ").length > 40;
  }

  /** Show/hide more images */
  toggleImagesView(): void {
    this.showAllImages = !this.showAllImages;
    this.visibleImages = this.showAllImages
      ? this.personImages
      : this.personImages.slice(0, 10);
  }

  /** Initialize swiper with custom settings */
  private initSwiper(): void {
    if (!this.personCredits || this.personCredits.length < 2) return;

    // Destroy existing swiper
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
        1150: { slidesPerView: 4},
        1500: { slidesPerView: Math.min(5, this.personCredits.length) }
      }
    });

    console.log('Swiper instance initialized ✅');
  }

  /** Navigate to media or person details page */
  goToMediaDetails(mediaType: string, mediaId: string): void {
    if (mediaType === 'person') {
      this._Router.navigate(['person-details', mediaType, mediaId]);
    } else {
      this._Router.navigate(['media-details', mediaType, mediaId]);
    }
  }
    addToHistory() {
  if (!this.uid) return;
  this.profileService.addToHistory(this.uid, {
    id: this.personDetails.id,
    title:this.personDetails.name,
    imageUrl: this.personDetails.profile_path ? 'https://image.tmdb.org/t/p/w500/' + this.personDetails.profile_path: '',
    type: 'person', // أو 'tv' أو 'person'
  }).then(() => {
    console.log('تمت الإضافة إلى history');
  });
}
}
