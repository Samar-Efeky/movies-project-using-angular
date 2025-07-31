// Import Angular core modules needed for component functionality
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
// Import common module and custom directive
import { CommonModule } from '@angular/common';
import { slideDown } from '../animations/animations';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  animations: [slideDown] // Add any animations if needed
})
export class NavbarComponent implements AfterViewInit {
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
    
    const display = window.getComputedStyle(this.searchBtn.nativeElement).display;
    if(display=="none"){
      this.showSearch=true;
    }
    else{
      this.showSearch=false;
    }
    
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
}
