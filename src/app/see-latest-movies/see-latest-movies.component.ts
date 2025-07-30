import { Component } from '@angular/core';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { Router } from '@angular/router';
@Component({
  selector: 'app-see-latest-movies',
  standalone: true,
  imports: [AnimateOnVisibleDirective],
  templateUrl: './see-latest-movies.component.html',
  styleUrl: './see-latest-movies.component.css'
})
export class SeeLatestMoviesComponent {
  constructor(private router: Router){}
  goToLatestMovies(): void {
    // Navigate to the route with parameters: mediaType = 'movie', category = 'now_playing'
    this.router.navigate(['media-collection', 'movie', 'top_rated']);
  }
}
