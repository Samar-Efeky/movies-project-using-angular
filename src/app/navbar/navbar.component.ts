// Import Angular core modules needed for component functionality
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
// Import common module and custom directive
import { CommonModule } from '@angular/common';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, Subject, Subscription } from 'rxjs';
import { MediaService } from '../services/media.service';
import { UserService } from '../services/user-service';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule,  RouterLink,AnimateOnVisibleDirective],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
    animations: [zoomIn, slideUp, slideDown] // Add any animations if needed
})
export class NavbarComponent implements AfterViewInit, OnInit, OnDestroy {
  // Flags
  overviewVisible = false;
  showSearch = false;
  isScrolled = false;

  // Data
  searchResults: any[] = [];
  profileImageUrl: string = '';
  isLoggedIn$!: Observable<boolean>;

  // Subjects
  private searchInput$ = new Subject<string>();

  // ViewChild references
  @ViewChild('sidebarToggleBtn', { static: false }) sidebarToggleBtn!: ElementRef;
  @ViewChild('searchBtn') searchBtn!: ElementRef;

  // Output events
  @Output() toggleContentLeft = new EventEmitter<void>();
  @Output() toggleBasedOnButtonDisplay = new EventEmitter<boolean>();

  // Subscriptions
  private searchSub!: Subscription;
  private mediaSearchSub!: Subscription;
  private userSub!: Subscription;
  private userDataSub!: Subscription;

  constructor(
    private mediaService: MediaService,
    private _Router: Router,
    private userService: UserService
  ) {
    this.isLoggedIn$ = this.userService.currentUser$.pipe(map(user => !!user));
  }

  ngOnInit(): void {
    // Listen for search input changes with debounce
   this.searchSub = this.searchInput$
  .pipe(debounceTime(300), distinctUntilChanged())
  .subscribe((query) => {
    if (this.mediaSearchSub) {
      this.mediaSearchSub.unsubscribe();
    }
    if (query.trim()) {
      this.mediaSearchSub = this.mediaService.searchMulti(query).subscribe((res) => {
        this.searchResults = res.results;
      });
    } else {
      this.searchResults = [];
    }
  });

    // Listen for user data
   this.userSub = this.userService.currentUser$.subscribe(user => {
  if (user) {
    this.userDataSub?.unsubscribe(); // cleanup old subscription
    this.userDataSub = this.userService.getUserData(user.uid).subscribe(snapshot => {
      this.profileImageUrl = snapshot.data()?.['imageUrl'] || 'assets/default-avatar.png';
    });
  }
});
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.checkInputSearch();
      this.checkSideBarToggleVisibility();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe all subscriptions
    this.searchSub?.unsubscribe();
    this.mediaSearchSub?.unsubscribe();
    this.userSub?.unsubscribe();
    this.userDataSub?.unsubscribe();

    // Clean up
    this.searchResults = [];
    this.searchInput$.complete();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollY > 100;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkInputSearch();
    this.checkSideBarToggleVisibility();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const inputEl = document.querySelector('.input-search input');
    const resultsEl = document.querySelector('.search-result-item');
    const clickedElement = event.target as HTMLElement;

    const isInsideInput = inputEl?.contains(clickedElement);
    const isInsideResults = resultsEl?.contains(clickedElement);

    if (!isInsideInput && !isInsideResults) {
      this.searchResults = [];
    }
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput$.next(value);
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  onButtonOpenSideBar(): void {
    this.toggleContentLeft.emit();
  }

  checkSideBarToggleVisibility(): void {
    if (this.sidebarToggleBtn) {
      const display = window.getComputedStyle(this.sidebarToggleBtn.nativeElement).display;
      const shouldShowSidebar = (display === 'none');
      this.toggleBasedOnButtonDisplay.emit(shouldShowSidebar);
    }
  }

  checkInputSearch(): void {
    const display = window.getComputedStyle(this.searchBtn.nativeElement).display;
    const activeElement = document.activeElement as HTMLElement;

    if (activeElement && activeElement.tagName === 'INPUT') return;

    this.showSearch = (display === 'none');
  }

  goToMediaDetails(mediaType: string, mediaId: string): void {
    if (mediaType === 'person') {
      this._Router.navigate(['person-details', mediaType, mediaId]);
    } else {
      this._Router.navigate(['media-details', mediaType, mediaId]);
    }

    this.searchResults = [];
    const inputElement = document.querySelector('.input-search input') as HTMLInputElement;
    if (inputElement) inputElement.value = '';
  }
}