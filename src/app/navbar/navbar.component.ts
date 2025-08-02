// Import Angular core modules needed for component functionality
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
// Import common module and custom directive
import { CommonModule } from '@angular/common';
import { slideDown } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { MediaService } from '../services/media.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, AnimateOnVisibleDirective, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [slideDown] // Add any animations if needed
})
export class NavbarComponent implements AfterViewInit, OnInit {
  overviewVisible = false; // Flag to track if the overview section is visible
  // Reference to the sidebar toggle button element in the template
  @ViewChild('sidebarToggleBtn', { static: false }) sidebarToggleBtn!: ElementRef;
  // Reference to the search button element in the template
  @ViewChild('searchBtn') searchBtn!: ElementRef;
  // Output event to toggle content layout from the parent
  @Output() toggleContentLeft = new EventEmitter<void>();
  // Boolean to control visibility of the search input
  @Output() toggleBasedOnButtonDisplay = new EventEmitter<boolean>();
  showSearch: boolean = false;
  // Boolean to track if the page is scrolled
  isScrolled = false;
    searchResults: any[] = [];
  private searchInput$ = new Subject<string>();
  constructor(private mediaService: MediaService, private _Router:Router) {}
  ngOnInit(): void {
     // Debounce user input
    this.searchInput$
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
   // Called when input changes
  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput$.next(value);

  }
  // Toggle the visibility of the search input
  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }
  // Emit event to notify parent component when sidebar toggle button is clicked
 checkSideBarToggleVisibility() {
  if (this.sidebarToggleBtn) {
    const display = window.getComputedStyle(this.sidebarToggleBtn.nativeElement).display;
    const shouldShowSidebar = (display === 'none'); // true يعني نعرض السايدبار
    this.toggleBasedOnButtonDisplay.emit(shouldShowSidebar);
  }
}
  // Check the display status of the search button and update visibility of search input accordingly
  checkInputSearch() {
    // Get the computed display style of the search button
  const display = window.getComputedStyle(this.searchBtn.nativeElement).display;

  // If the currently focused element is an input field (e.g., user is typing), do not change the search input visibility
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement && activeElement.tagName === 'INPUT') return;

  // Toggle the visibility of the search input based on the search button's display
  // If the search button is hidden (e.g., on small screens), show the search input
  this.showSearch = (display === 'none');
  }
  // Run check on initial view after component has rendered
  ngAfterViewInit(): void {
     setTimeout(() => {
    this.checkInputSearch();
    this.checkSideBarToggleVisibility();
  });
  }

  // Re-check on screen resize to update search input visibility
  @HostListener('window:resize')
  onResize() {
    this.checkInputSearch();
    this.checkSideBarToggleVisibility();
  }

  // Emit event to open the sidebar from parent component
  onButtonOpenSideBar() {
    this.toggleContentLeft.emit();
  }

  // Update scroll state to apply styling when scrolled
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollY > 100;
  }
  goToMediaDetails(mediaType:string, mediaId:string): void {
      // Navigate to the route with parameters: mediaType , media id
      if(mediaType=='person'){
        this._Router.navigate(['person-details',mediaType, mediaId]);
      }else{
        this._Router.navigate(['media-details',mediaType, mediaId]);
      }
       // Clear search input and results
  this.searchResults = [];
  const inputElement = document.querySelector('.input-search input') as HTMLInputElement;
  if (inputElement) inputElement.value = '';
    }
    @HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const inputEl = document.querySelector('.input-search input');
  const resultsEl = document.querySelector('.search-result-item');

  const clickedElement = event.target as HTMLElement;

  // Check if the clicked element is inside the input or the results
  const isInsideInput = inputEl?.contains(clickedElement);
  const isInsideResults = resultsEl?.contains(clickedElement);
}

    
}
