import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription, switchMap } from 'rxjs';
import { MediaDetailsService } from '../services/media-details.service';
import { MainHeaderPageComponent } from '../main-header-page/main-header-page.component';
import { DatePipe, CommonModule } from '@angular/common';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
// Declare Swiper from CDN
declare var Swiper: any;
@Component({
  selector: 'app-person-profile',
  standalone: true,
  imports: [MainHeaderPageComponent, DatePipe, CommonModule, SeeMorePipe,TimeAgoPipe, AnimateOnVisibleDirective],
  templateUrl: './person-profile.component.html',
  styleUrl: './person-profile.component.css',
  animations: [slideUp,zoomIn,slideDown]
})
export class PersonProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  visibleItems: { [key: number]: boolean } = {};
  // Flag to control the visibility of the overview section
   overviewVisible = false;
  //make a comments in english in the code
  sub!: Subscription;
  // Declare variables for media type and ID  
  type!: string;
  id!: string;
  personDetails:any = null; // Object to hold person details
  personImages:any[] = [];
  visibleImages: any[] = [];
showAllImages: boolean = false;
  personCredits:any[] = []; // Array to hold person credits
   showFullBiography = false;
  private swiperTimeout: any;
  private swiperInstance: any;
  toggleBiography() {
    this.showFullBiography = !this.showFullBiography;
  }
   shouldShowToggle(bio: string): boolean {
    return bio?.split(" ").length > 40;
  }
  // Use ViewChild to reference the swiper container element
    @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  constructor(private _MediaDetailsService:MediaDetailsService,
     private route: ActivatedRoute,private _Router:Router,
    private cd: ChangeDetectorRef) {}
  // OnInit lifecycle hook to subscribe to route parameters and fetch media details
  // The switchMap operator is used to switch to a new observable when the route parameters change  
  ngOnInit(): void {
     this.sub = this.route.paramMap.subscribe(params => {
      this.type = params.get('mediaType') || '';
      this.id = params.get('mediaId') || '';
      const dataSub = forkJoin({
              details: this._MediaDetailsService.getMediaDetails(this.type, this.id),
              images: this._MediaDetailsService.getMostDetails(this.type, this.id, 'images'),
              personCredits: this._MediaDetailsService.getMostDetails(this.type, this.id, 'combined_credits'),
        }).subscribe({
          next:({details, images,personCredits})=>{
            this.personDetails = details;
            this.personImages = images.profiles || [];
            this.visibleImages = this.personImages.slice(0, 10); // Show first 10 images initially
            this.personCredits = personCredits.cast || [];
            this.swiperTimeout = setTimeout(() => {
              if (this.personCredits.length >= 2) {
                this.initSwiper();
                this.cd.detectChanges();
              }
            }, 0);
          }
        
        })
    })
  }
  ngAfterViewInit(): void {
    // Initialize swiper only when movies are present
     this.swiperTimeout = setTimeout(() => {
        if (this.personCredits.length >= 2) {
          this.initSwiper();
        }
      }, 0);
  }
   initSwiper(): void {
    if (!this.personCredits || this.personCredits.length < 2) return;
    // Destroy old swiper if exists
    if (this.swiperInstance && typeof this.swiperInstance.destroy === 'function') {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }

    this.swiperInstance = new Swiper(this.swiperContainer.nativeElement, {
      loop: this.personCredits.length > 4,
      slidesPerView: Math.min(5, this.personCredits.length),
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
        0: { slidesPerView: 1 },
        570: { slidesPerView: 2 },
        830: { slidesPerView: 3 },
        1000: { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
        1300: { slidesPerView: 4 },
        1500: { slidesPerView: Math.min(5, this.personCredits.length) }
      }
    });

    console.log('Swiper instance initialized ✅');
  }
  toggleImagesView() {
  this.showAllImages = !this.showAllImages;

  this.visibleImages = this.showAllImages
    ? this.personImages
    : this.personImages.slice(0, 10);
}
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
  // Navigate to media details or person details based on mediaType
   goToMediaDetails(mediaType:string, mediaId:string): void {
      // Navigate to the route with parameters: mediaType , media id
      if(mediaType=='person'){
        this._Router.navigate(['person-details',mediaType, mediaId]);
      }else{
        this._Router.navigate(['media-details',mediaType, mediaId]);
      }
    }

}