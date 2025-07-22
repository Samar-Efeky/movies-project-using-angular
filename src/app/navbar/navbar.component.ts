
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
    isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled = scrollY > 50; // غيري 100 للارتفاع اللي تحبيه
  }
}
