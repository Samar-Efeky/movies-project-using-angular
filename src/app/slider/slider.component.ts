import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { MoviesService } from './../services/movies.service';
import { CommonModule } from '@angular/common';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

declare var Swiper: any;

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule,SeeMorePipe,AnimateOnVisibleDirective],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent implements OnInit, AfterViewInit {
  // Input properties to receive data from parent component
  @Input() category: string = 'popular';
  @Input() mediaType: string = 'movie';
  @Input() title: string = '';

  // Array to hold fetched movies
  movies: any[] = [];

  constructor(private _MoviesService: MoviesService) {}

  ngOnInit(): void {
    // Fetch movies from the API based on mediaType and category
    this._MoviesService.getMovies(this.mediaType, this.category).subscribe((res) => {
      this.movies = res.results;

      // Wait for DOM elements to render before initializing Swiper
      setTimeout(() => this.initSwiper(), 0);
    });
  }

  ngAfterViewInit(): void {
    // Initialize Swiper in case elements were not ready in ngOnInit
    setTimeout(() => this.initSwiper(), 0);
  }

  initSwiper() {
    // Configure and initialize Swiper instance
    new Swiper('.swiper', {
      loop: true,               // Enable looping of slides
      slidesPerView: 5,         // Show 5 slides by default
      spaceBetween: 20,         // Space between slides
      autoplay: {
        delay: 2500,            // Delay between slides in ms
        disableOnInteraction: false // Keep autoplay active after user interaction
      },
      navigation: {
        nextEl: '.swiper-button-next', // Next button selector
        prevEl: '.swiper-button-prev'  // Previous button selector
      },
      pagination: {
        el: '.swiper-pagination',     // Pagination element selector
        clickable: false              // Pagination is not clickable
      },
      breakpoints: {
        // Responsive settings: change slidesPerView based on screen width
        0: { slidesPerView: 1 },
        576: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        992: { slidesPerView: 4 },
        1200: { slidesPerView: 5 }
      }
    });
  }
}
