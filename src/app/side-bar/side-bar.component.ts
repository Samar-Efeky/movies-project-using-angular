import { Component, EventEmitter, Output, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { slideInOut } from '../animations/animations';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-side-bar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css',
  animations: [slideInOut]
})
export class SideBarComponent {
  @Output() linkClicked = new EventEmitter<void>();  // Event emitter to notify parent when a link is clicked

  // Movie menu options with labels and paths
  movieOptions = [
    { label: 'Top Rated', value: 'top_rated', pathToComponent: 'media-collection/movie/top_rated' },
    { label: 'Popular', value: 'popular', pathToComponent: 'media-collection/movie/popular' },
    { label: 'Upcoming', value: 'upcoming', pathToComponent: 'media-collection/movie/upcoming' },
    { label: 'Latest', value: 'latest', pathToComponent: 'media-collection/movie/now_playing' }
  ];

  // TV menu options with labels and paths
  tvOptions = [
    { label: 'Airing Today', value: 'airing_today', pathToComponent: 'media-collection/tv/airing_today' },
    { label: 'Popular', value: 'popular', pathToComponent: 'media-collection/tv/popular' },
    { label: 'Top Rated', value: 'top_rated', pathToComponent: 'media-collection/tv/top_rated' }
  ];

  selectedMovieOption: string | null = null;  // Currently selected movie option label
  selectedTVOption: string | null = null;     // Currently selected TV option label
  isMovieDropdownOpen = false;                 // Movie dropdown open state
  isTVDropdownOpen = false;                    // TV dropdown open state

  private router = inject(Router);             // Inject Router for navigation events

  constructor() {
    // Listen to router navigation end events
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()  // Auto unsubscribe on component destroy to avoid memory leaks
      )
      .subscribe((event: NavigationEnd) => {
        const currentUrl = event.urlAfterRedirects;

        // Reset selected movie option if current route is not a movie route
        const isMovieRoute = this.movieOptions.some(opt => currentUrl.includes(opt.pathToComponent));
        if (!isMovieRoute) this.selectedMovieOption = null;

        // Reset selected TV option if current route is not a TV route
        const isTVRoute = this.tvOptions.some(opt => currentUrl.includes(opt.pathToComponent));
        if (!isTVRoute) this.selectedTVOption = null;
      });
  }

  // Handle link click: emit event if screen width less than 1000, and scroll to top
  onLinkClick() {
    if (window.innerWidth < 1000) {
      this.linkClicked.emit();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toggle movie dropdown and close TV dropdown
  toggleMovieDropdown() {
    this.isMovieDropdownOpen = !this.isMovieDropdownOpen;
    this.isTVDropdownOpen = false;
  }

  // Toggle TV dropdown and close movie dropdown
  toggleTVDropdown() {
    this.isTVDropdownOpen = !this.isTVDropdownOpen;
    this.isMovieDropdownOpen = false;
  }

  // Select a movie option and close movie dropdown
  selectMovieOption(option: { label: string; value: string }) {
    this.selectedMovieOption = option.label;
    this.isMovieDropdownOpen = false;
  }

  // Select a TV option and close TV dropdown
  selectTVOption(option: { label: string; value: string }) {
    this.selectedTVOption = option.label;
    this.isTVDropdownOpen = false;
  }
}
