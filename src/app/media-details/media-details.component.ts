import {Component, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription, take } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { MediaDetailsService } from '../services/media-details.service';
import { FormsModule } from '@angular/forms'; 
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { slideDown, slideOutIn, slideUp, zoomIn } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { ProfileService } from '../services/profile-service';
import { UserService } from '../services/user-service';
@Component({
    selector: 'app-media-details',
    imports: [SeeMorePipe, FormsModule, TimeAgoPipe,AnimateOnVisibleDirective],
templateUrl: './media-details.component.html',
    styleUrl: './media-details.component.css',
    animations: [slideDown, slideUp, zoomIn, slideOutIn]
})
export class MediaDetailsComponent implements OnInit, OnDestroy{
  //make a simple comments in english explaining the purpose of each variable
  // Track visibility of items in the collection
   visibleItems: { [key: number]: boolean } = {}; // Track visibility of items in the collection
  // Flag to control the visibility of the overview section
   overviewVisible = false;
  // New comment input
  newComment: string = '';
  // Media type and ID from the route parameters
  type!: string;
  id!: string;
  // Media details object to hold fetched data
  mediaDetails: any = null;
  // Flags for showing full overview and comments
  showFullOverview: boolean = false;
  // Object to track which comments are fully shown
  showFullComments: { [reviewId: string]: boolean } = {};
  // Safe URL for the trailer video
  trailerKey: SafeResourceUrl | null = null;
  // Media recommendations
  mediaRecommendations: any[] = [];
  // Cast and crew details
  cast: any[] = [];
  crew: any[] = [];
  // Reviews list
  reviewsList: any[] = [];
  // Boolean to control the visibility of recommendations on smaller screens
  MoveRight: boolean = false;
  // Media query to check screen width
  mediaQuery!: MediaQueryList;
  // Subscription to manage multiple subscriptions
  private subscriptions = new Subscription();
  uid: string = '';
  constructor(
    private _MediaDetailsService: MediaDetailsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private _Router: Router,
    private profileService: ProfileService,
    private userService: UserService
  ) {}
  // Method to check screen width and set MoveRight accordingly
   checkScreenWidth() {
    this.MoveRight = this.mediaQuery.matches;
  }
  // Method to toggle the visibility of recommendations on smaller screens
  ngOnInit(): void {
    this.userService.currentUser$.pipe(take(1)).subscribe(user => {
  if (user) {
    this.uid = user.uid;
  }
});
    // Initialize media query to check for specific screen widths
    this.mediaQuery = window.matchMedia(
      '(min-width: 1301px), (min-width: 901px) and (max-width: 999px)'
    );
    // Check screen width on initialization
    this.checkScreenWidth();
    // Add event listener to update MoveRight on screen width changes
    this.mediaQuery.addEventListener('change', this.checkScreenWidth.bind(this));
    // Subscribe to route parameters to fetch media details
    const sub = this.route.paramMap.subscribe(params => {
      this.type = params.get('mediaType') || '';
      this.id = params.get('mediaId') || '';
      // Fetch media details, credits, videos, recommendations, and reviews
      const dataSub = forkJoin({
        details: this._MediaDetailsService.getMediaDetails(this.type, this.id),
        credits: this._MediaDetailsService.getMostDetails(this.type, this.id, 'credits'),
        videos: this._MediaDetailsService.getMostDetails(this.type, this.id, 'videos'),
        recommendations: this._MediaDetailsService.getMostDetails(this.type, this.id, 'recommendations'),
        reviews: this._MediaDetailsService.getMostDetails(this.type, this.id, 'reviews')
      }).subscribe({
        // Handle successful data retrieval
        next: ({ details, videos, recommendations, credits, reviews }) => {
          this.mediaDetails = details;
          if (this.uid && this.mediaDetails) {
            this.addToHistory();
        }
          this.mediaRecommendations = recommendations.results || [];
          this.cast = credits.cast?.slice(0, 8) || [];
          this.crew = credits.crew?.slice(0, 8) || [];
          this.reviewsList = reviews.results || [];
          // Process videos to find the trailer
          const trailer = videos.results.find((vid: any) =>
            vid.type === 'Trailer' && vid.site === 'YouTube'
          );
          // Set the trailer key as a safe resource URL
          this.trailerKey = trailer
            ? this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + trailer.key)
            : null;
        },
        error: (err) => console.error('Error loading data:', err)
      });
      // Add the data subscription to the list of subscriptions
      this.subscriptions.add(dataSub);
    });
    // Add the route subscription to the list of subscriptions
    this.subscriptions.add(sub);
  }
  // Method to toggle the visibility of the overview section
  onToggleRecommend() {
    if(this.mediaQuery.matches){
      return
    }
    this.MoveRight = !this.MoveRight;
  }
  // Method to toggle the visibility of the overview section
  toggleOverview() {
    this.showFullOverview = !this.showFullOverview;
  }
  // Method to toggle the visibility of a specific comment
  toggleComment(reviewId: string) {
    this.showFullComments[reviewId] = !this.showFullComments[reviewId];
  }
  // Method to check if a comment is long based on word count
  isLongComment(comment: string): boolean {
    return comment?.split(' ').length > 35;
  }
  // Method to check if a comment is fully shown
  isFullShown(reviewId: string): boolean {
    return this.showFullComments[reviewId] || false;
  }
  // Method to post a new comment
  postComment() {
    if (!this.newComment.trim()) return;

    this.reviewsList.unshift({
      username: 'NewUser',
      timeAgo: 'just now',
      text: this.newComment,
      avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
    });
    this.newComment = '';
  }
  // Method to cancel a new comment input
  cancelComment() {
    this.newComment = '';
  }
  // Method to navigate to media details page
  goToMediaDetails(mediaType: string, mediaId: string): void {
    this._Router.navigate(['media-details', mediaType, mediaId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Method to navigate to profile details page
  goToProfileDetails(mediaType: string, mediaId: string): void {
    this._Router.navigate(['person-details', mediaType, mediaId]);
  }
  addToHistory() {
  if (!this.uid) return;
  this.profileService.addToHistory(this.uid, {
    id: this.mediaDetails.id,
    title: this.mediaDetails.title || this.mediaDetails.name,
    imageUrl: this.mediaDetails.poster_path ? 'https://image.tmdb.org/t/p/w500/' + this.mediaDetails.poster_path : '',
    type: this.type, // أو 'tv' أو 'person'
  });
}
  // Method to navigate to media collection page
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.unsubscribe();
    this.mediaDetails = null;
    this.cast = [];
    this.crew = [];
    this.reviewsList = [];
    this.mediaRecommendations = [];
    this.trailerKey = null;
    this.mediaQuery.removeEventListener('change', this.checkScreenWidth.bind(this));
  }
}
