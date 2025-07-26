import { Component, OnInit } from '@angular/core';
import { MoviesService } from './../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription, switchMap } from 'rxjs';
import { MainHeaderPageComponent } from "../main-header-page/main-header-page.component";
  import { CommonModule } from '@angular/common';
import { SeeMorePipe } from '../pipes/see-more.pipe';
@Component({
  selector: 'app-media-collection',
  standalone: true,
  imports: [MainHeaderPageComponent, CommonModule, SeeMorePipe],
templateUrl: './media-collection.component.html',
  styleUrl: './media-collection.component.css'
})
export class MediaCollectionComponent implements OnInit {
  // Route parameters for media type and category
  mediaType!: string;
  category!: string;

  // Full media list and paginated media to display per page
  mediaCollection: any[] = [];
  paginatedMedia: any[] = [];

  // Current page and items per page for pagination
  currentPage: number = 1;
  itemsPerPage: number = 12;

  constructor(private _MoviesService: MoviesService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Listen to route params and fetch 3 pages of media data
    this.route.paramMap
      .pipe(
        switchMap(params => {
          this.mediaType = params.get('mediaType') || '';
          this.category = params.get('category') || '';

          // Fetch data from 3 pages in parallel
          const page1 = this.getMedia(this.mediaType, this.category, '1');
          const page2 = this.getMedia(this.mediaType, this.category, '2');
          const page3 = this.getMedia(this.mediaType, this.category, '3');

          return forkJoin([page1, page2, page3]);
        })
      )
      .subscribe(([res1, res2, res3]) => {
        // Combine results from the 3 pages
        this.mediaCollection = [
          ...res1.results,
          ...res2.results,
          ...res3.results,
        ];
        // Update paginated list to display
        this.updatePagination();
      });
  }

  // Get media data based on type (trending or other)
  getMedia(mediaType: string, category: string, page: string) {
    if (mediaType === 'trending') {
      return this._MoviesService.getTrending(mediaType, category, page);
    } else {
      return this._MoviesService.getMediaCollection(mediaType, category, page);
    }
  }

  // Slice full list to get items for current page
  updatePagination() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedMedia = this.mediaCollection.slice(start, end);
  }

  // Change current page and refresh displayed items
  changePage(page: number) {
    if (page !== this.currentPage) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  // Generate smart pagination range with ellipsis
  get smartPagination(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const range: (number | string)[] = [];

    if (total <= 4) {
      // Show all pages if total is small
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    range.push(1); // Always show first page

    if (current > 4) {
      range.push('...');
    }

    // Show current, one before and one after
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (current < total - 3) {
      range.push('...');
    }

    range.push(total); // Always show last page

    return range;
  }

  // Check if a value is a number (used in pagination buttons)
  isNumber(value: number | string): value is number {
    return typeof value === 'number';
  }

  // Calculate total number of pages
  get totalPages(): number {
    return Math.ceil(this.mediaCollection.length / this.itemsPerPage);
  }
}
