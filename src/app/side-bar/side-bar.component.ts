import { Component } from '@angular/core';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [AnimateOnVisibleDirective, RouterLink, RouterLinkActive],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

  // Movie dropdown options with labels for display and values for API use
  movieOptions = [
    { label: 'Top Rated', value: 'top_rated' },
    { label: 'Popular', value: 'popular' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Latest', value: 'latest' }
  ];

  // TV dropdown options
  tvOptions = [
    { label: 'Airing Today', value: 'airing_today' },
    { label: 'Popular', value: 'popular' },
    { label: 'Top Rated', value: 'top_rated' }
  ];

  // Stores the selected movie option label
  selectedMovieOption: string | null = null;

  // Stores the selected TV option label
  selectedTVOption: string | null = null;

  // Controls visibility of movie dropdown list
  isMovieDropdownOpen = false;

  // Controls visibility of TV dropdown list
  isTVDropdownOpen = false;

  // Toggles movie dropdown and closes TV dropdown
  toggleMovieDropdown() {
    this.isMovieDropdownOpen = !this.isMovieDropdownOpen;
    this.isTVDropdownOpen = false;
  }

  // Toggles TV dropdown and closes movie dropdown
  toggleTVDropdown() {
    this.isTVDropdownOpen = !this.isTVDropdownOpen;
    this.isMovieDropdownOpen = false;
  }

  // Handles movie option selection
  selectMovieOption(option: { label: string; value: string }) {
    this.selectedMovieOption = option.label; // Updates displayed label
    this.isMovieDropdownOpen = false;        // Closes dropdown
    console.log('Selected Movie:', option.value); // Logs selected value for API use
  }

  // Handles TV option selection
  selectTVOption(option: { label: string; value: string }) {
    this.selectedTVOption = option.label; // Updates displayed label
    this.isTVDropdownOpen = false;        // Closes dropdown
    console.log('Selected TV:', option.value); // Logs selected value for API use
  }

}
