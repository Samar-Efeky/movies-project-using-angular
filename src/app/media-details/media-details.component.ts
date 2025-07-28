import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';

@Component({
  selector: 'app-media-details',
  standalone: true,
  imports: [],
  templateUrl: './media-details.component.html',
  styleUrl: './media-details.component.css'
})
export class MediaDetailsComponent {
  constructor(private _moviesService:MoviesService){}
  
}
