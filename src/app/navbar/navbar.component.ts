// Import Angular core modules needed for component functionality
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
// Import common module and custom directive
import { CommonModule } from '@angular/common';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AnimateOnVisibleDirective, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit {
  // Reference to the search button element in the template
  @ViewChild('searchBtn') searchBtn!: ElementRef;
  // Output event to toggle content layout from the parent
  @Output() toggleContentLeft = new EventEmitter<void>();
  // Boolean to control visibility of the search input
  showSearch: boolean = false;
  // Boolean to track if the page is scrolled
  isScrolled = false;

  // Toggle the visibility of the search input
  toggleSearch(): void {
    this.showSearch = !this.showSearch;
  }

  // Check the display status of the search button and update visibility of search input accordingly
  checkInputSearch() {
    if (!this.searchBtn) return;
    const display = window.getComputedStyle(this.searchBtn.nativeElement).display;
    this.showSearch = display === "none";
  }

  // Run check on initial view after component has rendered
  ngAfterViewInit(): void {
    this.checkInputSearch();
  }

  // Re-check on screen resize to update search input visibility
  @HostListener('window:resize')
  onResize() {
    this.checkInputSearch();
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
