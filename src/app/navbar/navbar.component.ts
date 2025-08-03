// Import Angular core modules needed for component functionality
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// Import common module and custom directive
import { CommonModule } from '@angular/common';
import { slideDown } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AnimateOnVisibleDirective, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [slideDown] // Add any animations if needed
})
export class NavbarComponent implements AfterViewInit, OnInit, OnDestroy {
  // Flag to track visibility of overview section
  overviewVisible = false;

  // Flag to track visibility of search input
  showSearch = false;

  // Flag to track scroll status for styling
  isScrolled = false;

  // Store search results from API
  searchResults: any[] = [];

  // Subject to stream search input value
  private searchInput$ = new Subject<string>();

  // ViewChild to access sidebar toggle button
  @ViewChild('sidebarToggleBtn', { static: false }) sidebarToggleBtn!: ElementRef;

  // ViewChild to access search button
  @ViewChild('searchBtn') searchBtn!: ElementRef;

  // Emit event to parent to open sidebar
  @Output() toggleContentLeft = new EventEmitter<void>();

  // Emit event to parent to toggle layout based on sidebar button visibility
  @Output() toggleBasedOnButtonDisplay = new EventEmitter<boolean>();

  // Subscription reference for cleanup
  private searchSub!: Subscription;

  constructor(private mediaService: MediaService, private _Router: Router) {}

  /** Lifecycle hook: OnInit */
  ngOnInit(): void {
    // Listen for search input changes with debounce
    this.searchSub = this.searchInput$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim()) {
          this.mediaService.searchMulti(query).subscribe((res) => {
            this.searchResults = res.results;
          });
        } else {
          this.searchResults = [];
        }
      });
  }

  /** Lifecycle hook: AfterViewInit */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkInputSearch();
      this.checkSideBarToggleVisibility();
    });
  }

  /** Lifecycle hook: OnDestroy - clean up subscriptions */
  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
    this.searchResults = [];
    this.searchInput$.complete();
  }

  /** HostListener: On window scroll - update scroll flag */
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollY > 100;
  }

  /** HostListener: On window resize - recheck visibility states */
  @HostListener('window:resize')
  onResize(): void {
    this.checkInputSearch();
    this.checkSideBarToggleVisibility();
  }

  /** HostListener: Click outside input/result hides dropdown - Optional */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const inputEl = document.querySelector('.input-search input');
    const resultsEl = document.querySelector('.search-result-item');
    const clickedElement = event.target as HTMLElement;

    const isInsideInput = inputEl?.contains(clickedElement);
    const isInsideResults = resultsEl?.contains(clickedElement);

    // Optional behavior: if needed, clear results on outside click
    // if (!isInsideInput && !isInsideResults) {
    //   this.searchResults = [];
    // }
  }

  /** Called on input event from search input */
  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput$.next(value);
  }

  /** Toggle visibility of search input */
  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  /** Emit to parent when sidebar toggle button is clicked */
  onButtonOpenSideBar(): void {
    this.toggleContentLeft.emit();
  }

  /** Emit boolean to parent based on sidebar button visibility */
  checkSideBarToggleVisibility(): void {
    if (this.sidebarToggleBtn) {
      const display = window.getComputedStyle(this.sidebarToggleBtn.nativeElement).display;
      const shouldShowSidebar = (display === 'none');
      this.toggleBasedOnButtonDisplay.emit(shouldShowSidebar);
    }
  }

  /** Check search button visibility and show input if hidden */
  checkInputSearch(): void {
    const display = window.getComputedStyle(this.searchBtn.nativeElement).display;
    const activeElement = document.activeElement as HTMLElement;

    if (activeElement && activeElement.tagName === 'INPUT') return;

    this.showSearch = (display === 'none');
  }

  /** Navigate to media or person details page */
  goToMediaDetails(mediaType: string, mediaId: string): void {
    if (mediaType === 'person') {
      this._Router.navigate(['person-details', mediaType, mediaId]);
    } else {
      this._Router.navigate(['media-details', mediaType, mediaId]);
    }

    // Clear search results and reset input
    this.searchResults = [];
    const inputElement = document.querySelector('.input-search input') as HTMLInputElement;
    if (inputElement) inputElement.value = '';
  }
}
