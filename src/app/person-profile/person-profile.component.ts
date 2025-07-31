import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { MediaDetailsService } from '../services/media-details.service';

@Component({
  selector: 'app-person-profile',
  standalone: true,
  imports: [],
  templateUrl: './person-profile.component.html',
  styleUrl: './person-profile.component.css'
})
export class PersonProfileComponent implements OnInit, OnDestroy {
  //make a comments in english in the code
  
  // Declare variables for media type and ID  
  type!: string;
  id!: string;
  profileDetails: any;
  // Subscription to manage the route parameters
  // This will help in unsubscribing when the component is destroyed
  private routeSubscription!: Subscription;
  // Inject the MediaDetailsService and ActivatedRoute to fetch media details based on route parameters
  // ActivatedRoute is used to access the current route parameters
  constructor(private _MediaDetailsService:MediaDetailsService, private route: ActivatedRoute) {}
  // OnInit lifecycle hook to subscribe to route parameters and fetch media details
  // The switchMap operator is used to switch to a new observable when the route parameters change  
  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        this.type = params.get('mediaType') || '';
        this.id = params.get('mediaId') || '';
        return this._MediaDetailsService.getMediaDetails(this.type, this.id);
      })
    ).subscribe({
      next: (res) => {
        console.log('Media Details:', res);
        this.profileDetails = res;
      },
      error: (err) => {
        console.error('Error fetching media details:', err);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
      console.log('Unsubscribed from route paramMap.');
    }
  }

}