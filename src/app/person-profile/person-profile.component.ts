import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subscription, switchMap } from 'rxjs';
import { MediaDetailsService } from '../services/media-details.service';
import { MainHeaderPageComponent } from '../main-header-page/main-header-page.component';
import { DatePipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-profile',
  standalone: true,
  imports: [MainHeaderPageComponent, DatePipe, CommonModule],
  templateUrl: './person-profile.component.html',
  styleUrl: './person-profile.component.css'
})
export class PersonProfileComponent implements OnInit, OnDestroy {
  //make a comments in english in the code
  sub!: Subscription;
  // Declare variables for media type and ID  
  type!: string;
  id!: string;
  personDetails:any = null; // Object to hold person details
  personImages:any[] = [];
  personMovieCredits:any[] = []; 
  personTVCredits:any[] = [];
  
  constructor(private _MediaDetailsService:MediaDetailsService, private route: ActivatedRoute) {}
  // OnInit lifecycle hook to subscribe to route parameters and fetch media details
  // The switchMap operator is used to switch to a new observable when the route parameters change  
  ngOnInit(): void {
     this.sub = this.route.paramMap.subscribe(params => {
      this.type = params.get('mediaType') || '';
      this.id = params.get('mediaId') || '';
      const dataSub = forkJoin({
              details: this._MediaDetailsService.getMediaDetails(this.type, this.id),
              images: this._MediaDetailsService.getMostDetails(this.type, this.id, 'images'),
              movieCredits: this._MediaDetailsService.getMostDetails(this.type, this.id, 'movie_credits'),
              TVCredits: this._MediaDetailsService.getMostDetails(this.type, this.id, 'tv_credits')
        }).subscribe({
          next:({details, images, movieCredits, TVCredits})=>{
            this.personDetails = details;
            console.log('Person Details:', this.personDetails);
            
            this.personImages = images.profiles || [];
            this.personMovieCredits = movieCredits.cast || [];
            this.personTVCredits = TVCredits.cast || [];
          }
        })
    })
  }

  ngOnDestroy(): void {
   this.sub?.unsubscribe();
  }

}