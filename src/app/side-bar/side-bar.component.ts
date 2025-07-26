import { Component, EventEmitter, Output } from '@angular/core';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [AnimateOnVisibleDirective, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {
 // Create an output event to notify the parent when a link is clicked
@Output() linkClicked = new EventEmitter<void>();

// Emit the event when a link is clicked
onLinkClick() {
  this.linkClicked.emit(); // Notify the parent component
}
  // Movie dropdown options with corresponding navigation paths
movieOptions = [
  { label: 'Top Rated', value: 'top_rated', pathToComponent:'media-collection/movie/top_rated' },
  { label: 'Popular', value: 'popular', pathToComponent:'media-collection/movie/popular' },
  { label: 'Upcoming', value: 'upcoming' , pathToComponent:'media-collection/movie/upcoming'},
  { label: 'Latest', value: 'latest', pathToComponent:'media-collection/movie/now_playing' }
];

// TV dropdown options with corresponding navigation paths
tvOptions = [
  { label: 'Airing Today', value: 'airing_today' , pathToComponent:'media-collection/tv/airing_today'},
  { label: 'Popular', value: 'popular', pathToComponent:'media-collection/tv/popular' },
  { label: 'Top Rated', value: 'top_rated' , pathToComponent:'media-collection/tv/top_rated'}
];

// Currently selected option from movie dropdown
selectedMovieOption: string | null = null;

// Currently selected option from TV dropdown
selectedTVOption: string | null = null;

// Toggle state of movie dropdown
isMovieDropdownOpen = false;

// Toggle state of TV dropdown
isTVDropdownOpen = false;

constructor(private router: Router) {
  // Listen to navigation changes and reset selected options if route is not in the list
  this.router.events
    .pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      const currentUrl = event.urlAfterRedirects;

      // Clear movie selection if current route is not a movie path
      const isMovieRoute = this.movieOptions.some(opt => currentUrl.includes(opt.pathToComponent));
      if (!isMovieRoute) this.selectedMovieOption = null;

      // Clear TV selection if current route is not a TV path
      const isTVRoute = this.tvOptions.some(opt => currentUrl.includes(opt.pathToComponent));
      if (!isTVRoute) this.selectedTVOption = null;
    });
}

// Toggle movie dropdown visibility and close TV dropdown
toggleMovieDropdown() {
  this.isMovieDropdownOpen = !this.isMovieDropdownOpen;
  this.isTVDropdownOpen = false;
}

// Toggle TV dropdown visibility and close movie dropdown
toggleTVDropdown() {
  this.isTVDropdownOpen = !this.isTVDropdownOpen;
  this.isMovieDropdownOpen = false;
}

// Set selected movie option and close the movie dropdown
selectMovieOption(option: { label: string; value: string }) {
  this.selectedMovieOption = option.label;
  this.isMovieDropdownOpen = false;
}

// Set selected TV option and close the TV dropdown
selectTVOption(option: { label: string; value: string }) {
  this.selectedTVOption = option.label;
  this.isTVDropdownOpen = false;
}

}
