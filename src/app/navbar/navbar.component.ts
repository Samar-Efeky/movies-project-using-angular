
import { Component, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AnimateOnVisibleDirective, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Boolean to track if the page has been scrolled past a certain point
  isScrolled = false;

  // Listen to the window scroll event
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Get the current scroll position (supports all browsers)
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Set isScrolled to true if scrolled more than 50px, false otherwise
    this.isScrolled = scrollY > 100; // You can change 50 to any value you prefer
  }
}
