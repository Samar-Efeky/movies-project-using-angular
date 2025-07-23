import { Component } from '@angular/core';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

@Component({
  selector: 'app-see-latest-movies',
  standalone: true,
  imports: [AnimateOnVisibleDirective],
  templateUrl: './see-latest-movies.component.html',
  styleUrl: './see-latest-movies.component.css'
})
export class SeeLatestMoviesComponent {

}
