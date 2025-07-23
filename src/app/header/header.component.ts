import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { MoviesService } from '../services/movies.service';
import { CommonModule } from '@angular/common';
import { SeeMorePipe } from '../pipes/see-more.pipe';
declare var Swiper: any;
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AnimateOnVisibleDirective,CommonModule, SeeMorePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  // Input properties to get media type and category from parent component
  @Input() category: string = 'popular';
  @Input() mediaType: string = 'movie';

  // Array to store fetched movies
  movies: any[] = [];

  constructor(private _MoviesService: MoviesService) {}

  // Called when component is initialized
  ngOnInit(): void {
    // Fetch movies from the service based on mediaType and category
    this._MoviesService.getMovies(this.mediaType, this.category).subscribe((res) => {
      this.movies = res.results;
      console.log(this.movies);

      // Wait for the view to update before initializing Swiper
      setTimeout(() => this.initSwiper(), 500);
    });
  }

  // Called after the view is fully initialized
  ngAfterViewInit(): void {
    // Extra delay to make sure Swiper initializes after images are loaded
    setTimeout(() => this.initSwiper(), 500);
  }

  // Function to initialize Swiper carousel
  initSwiper() {
    new Swiper('.mySwiper1', {
      loop: true,
      slidesPerView: 1,
      autoplay: {
        delay: 1500, // 1.5 seconds delay between slides
        disableOnInteraction: false
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: false
      }
    });
  }
}
