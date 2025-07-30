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
  type!: string;
  id!: string;
  profileDetails: any;

  private routeSubscription!: Subscription;

  constructor(private _MediaDetailsService:MediaDetailsService, private route: ActivatedRoute) {}

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