import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SliderComponent } from '../slider/slider.component';
import { SeeLatestMoviesComponent } from '../see-latest-movies/see-latest-movies.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeaderComponent,SliderComponent,SeeLatestMoviesComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
