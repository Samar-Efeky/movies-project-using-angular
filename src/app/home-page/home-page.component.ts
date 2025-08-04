import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { SliderComponent } from '../slider/slider.component';
import { SeeLatestMoviesComponent } from '../see-latest-movies/see-latest-movies.component';

import { LazyLoadDirective } from '../directives/lazy-load.directive';

@Component({
    selector: 'app-home-page',
    imports: [HeaderComponent, SliderComponent, SeeLatestMoviesComponent, LazyLoadDirective],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit, OnDestroy {
  // Control general slider visibility
  slidersVisible = true;

  // Flags to show specific sliders after lazy load
  showTrendingSlider = false;
  showTopRatedSlider = false;

  ngOnInit() {
    // Show all regular sliders when component initializes
    this.slidersVisible = true;
  }

  // Triggered when the trending slider comes into view
  onTrendingLazyLoad() {
    this.showTrendingSlider = true;
  }

  // Triggered when the top-rated slider comes into view
  onTopRatedLazyLoad() {
    this.showTopRatedSlider = true;
  }

  ngOnDestroy() {
    // Hide sliders when component is destroyed
    this.slidersVisible = false;
  }
}
