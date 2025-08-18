import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription, switchMap } from 'rxjs';
import { MainHeaderPageComponent } from "../main-header-page/main-header-page.component";
  import { CommonModule } from '@angular/common';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { MediaService } from '../services/media.service';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
@Component({
    selector: 'app-media-collection',
    imports: [MainHeaderPageComponent, CommonModule, SeeMorePipe, TimeAgoPipe, AnimateOnVisibleDirective],
    templateUrl: './media-collection.component.html',
    styleUrl: './media-collection.component.css',
    animations: [zoomIn, slideDown, slideUp]
})
export class MediaCollectionComponent implements OnInit, OnDestroy {
  // Route parameters
  mediaType!: string;
  category!: string;
   visibleItems: { [key: number]: boolean } = {}; // Track visibility of items in the collection
  // Full media list and paginated version
  mediaCollection: any[] = [];
  paginatedMedia: any[] = [];

  // Pagination control
  currentPage: number = 1;
  itemsPerPage: number = 20;

  // To manage multiple subscriptions
  private subscriptions = new Subscription();

  constructor(private _MediaService: MediaService, private route: ActivatedRoute,private _Router:Router) {}

  ngOnInit(): void {
    // Subscribe to route parameters and fetch media data (3 pages)
    const routeSub = this.route.paramMap
      .pipe(
        switchMap(params => {
          this.mediaType = params.get('mediaType') || '';
          this.category = params.get('category') || '';

          const page1 = this.getMedia(this.mediaType, this.category, '1');
          const page2 = this.getMedia(this.mediaType, this.category, '2');
          const page3 = this.getMedia(this.mediaType, this.category, '3');
          const page4= this.getMedia(this.mediaType, this.category, '4');
          return forkJoin([page1, page2, page3,page4]);
        })
      )
      .subscribe(([res1, res2, res3, res4]) => {
        // Combine results from 3 pages
        this.mediaCollection = [
          ...res1.results,
          ...res2.results,
          ...res3.results,
          ...res4.results,
        ];
        this.updatePagination(); // Update the visible page
      });

    this.subscriptions.add(routeSub); // Add to subscription list
  }
  // Fetch media based on type and category
  getMedia(mediaType: string, category: string, page: string) {
    if (mediaType === 'trending') {
      return this._MediaService.getTrending(category, 'day', page);
    } else {
      return this._MediaService.getMediaCollection(mediaType, category, page);
    }
  }
 trackMedia(index: number, item: any): string {
  const id = item.id || 'no-id';
  const name = item.name || item.title || 'no-name';
  const image = item.profile_path || item.poster_path || 'no-image';

  return `${id}-${name}-${image}-${index}`;
}
  // Slice data to show only current page
  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedMedia = this.mediaCollection.slice(start, end);
  }

  // Change page and scroll to media section
  changePage(page: number) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.updatePagination();

      const element = document.getElementById('media-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Smart pagination logic (handles ellipsis ...)
  get smartPagination(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const range: (number | string)[] = [];

    if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);

    range.push(1);
    if (current > 3) range.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (current < total - 2) range.push('...');

    range.push(total);
    return range;
  }

  // Type guard to check if value is a number
  isNumber(value: number | string): value is number {
    return typeof value === 'number';
  }

  // Total number of pages
  get totalPages(): number {
    return Math.ceil(this.mediaCollection.length / this.itemsPerPage);
  }
    goToMediaDetails(mediaType:string, mediaId:string): void {
      // Navigate to the route with parameters: mediaType , media id
      if(mediaType=='person'){
        this._Router.navigate(['person-details',mediaType, mediaId]);
      }else{
        this._Router.navigate(['media-details',mediaType, mediaId]);
      }
    }
    
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to avoid memory leaks
    this.subscriptions.unsubscribe();
  }
}
