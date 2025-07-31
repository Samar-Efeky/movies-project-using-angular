import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
@Component({
  selector: 'app-see-latest-movies',
  standalone: true,
  imports: [],
  templateUrl: './see-latest-movies.component.html',
  styleUrl: './see-latest-movies.component.css',
  animations: [slideDown, slideUp,zoomIn],
})
export class SeeLatestMoviesComponent {
  constructor(private router: Router){}
  goToLatestMovies(): void {
    // Navigate to the route with parameters: mediaType = 'movie', category = 'now_playing'
    this.router.navigate(['media-collection', 'movie', 'top_rated']);
  }
}
