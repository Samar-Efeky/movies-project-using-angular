import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { MediaDetailsService } from '../services/media-details.service';
import { FormsModule } from '@angular/forms'; 
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
@Component({
  selector: 'app-media-details',
  standalone: true,
  imports: [CommonModule,SeeMorePipe, FormsModule, TimeAgoPipe],
  templateUrl: './media-details.component.html',
  styleUrl: './media-details.component.css',
  animations: [slideDown,slideUp,zoomIn]
})
export class MediaDetailsComponent implements OnInit, OnDestroy {
  newComment: string = '';
  type!: string;
  id!: string;

  mediaDetails: any = null;
  showFullOverview: boolean = false;
  showFullComments: { [reviewId: string]: boolean } = {};
  trailerKey: SafeResourceUrl | null = null;
  mediaRecommendations: any[] = [];
  cast: any[] = [];
  crew: any[] = [];
  reviewsList: any[] = [];
  MoveRight: boolean = false;
  private subscriptions = new Subscription();

  constructor(
    private _MediaDetailsService: MediaDetailsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    const sub = this.route.paramMap.subscribe(params => {
      this.type = params.get('mediaType') || '';
      this.id = params.get('mediaId') || '';

      const dataSub = forkJoin({
        details: this._MediaDetailsService.getMediaDetails(this.type, this.id),
        credits: this._MediaDetailsService.getMostDetails(this.type, this.id, 'credits'),
        videos: this._MediaDetailsService.getMostDetails(this.type, this.id, 'videos'),
        recommendations: this._MediaDetailsService.getMostDetails(this.type, this.id, 'recommendations'),
        reviews: this._MediaDetailsService.getMostDetails(this.type, this.id, 'reviews')
      }).subscribe({
        next: ({ details, videos, recommendations, credits, reviews }) => {
          this.mediaDetails = details;
          this.mediaRecommendations = recommendations.results || [];
          this.cast = credits.cast?.slice(0, 8) || [];
          this.crew = credits.crew?.slice(0, 8) || [];
          this.reviewsList = reviews.results || [];

          const trailer = videos.results.find((vid: any) =>
            vid.type === 'Trailer' && vid.site === 'YouTube'
          );

          this.trailerKey = trailer
            ? this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + trailer.key)
            : null;
        },
        error: (err) => console.error('Error loading data:', err)
      });
      this.subscriptions.add(dataSub);
    });
    this.subscriptions.add(sub);
  }

  toggleOverview() {
    this.showFullOverview = !this.showFullOverview;
  }

  toggleComment(reviewId: string) {
    this.showFullComments[reviewId] = !this.showFullComments[reviewId];
  }

  isLongComment(comment: string): boolean {
    return comment?.split(' ').length > 35;
  }

  isFullShown(reviewId: string): boolean {
    return this.showFullComments[reviewId] || false;
  }

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

  cancelComment() {
    this.newComment = '';
  }

  onToggleRecommend() {
    this.MoveRight = !this.MoveRight;
  }

  goToMediaDetails(mediaType: string, mediaId: string): void {
    this._Router.navigate(['media-details', mediaType, mediaId]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToProfileDetails(mediaType: string, mediaId: string): void {
    this._Router.navigate(['person-details', mediaType, mediaId]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.mediaDetails = null;
    this.cast = [];
    this.crew = [];
    this.reviewsList = [];
    this.mediaRecommendations = [];
    this.trailerKey = null;
  }
}