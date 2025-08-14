import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../services/user-service';
import { ProfileService } from '../services/profile-service';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { SeeMorePipe } from '../pipes/see-more.pipe';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
import { slideDown, slideUp, zoomIn } from '../animations/animations';

@Component({
  selector: 'app-profile-component',
  imports: [CommonModule, SeeMorePipe, AnimateOnVisibleDirective],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css',
  animations:[slideDown,slideUp,zoomIn]
})
export class ProfileComponent implements OnInit, OnDestroy {
  profile: any;
  uid: string = '';
  history$: Observable<any[]> = of([]);
  favorites$: Observable<any[]> = of([]);

  // Subject to signal when the component is destroyed
  private destroy$ = new Subject<void>();

  constructor(
    private UserService: UserService,
    private _ProfileService: ProfileService,
    private _Router: Router
  ) {}

  ngOnInit() {
    // Subscribe to the current user and load profile data
    // `takeUntil(this.destroy$)` ensures the subscription is automatically unsubscribed when the component is destroyed
    this.UserService.currentUser$
      .pipe(
        switchMap(user => {
          if (user) {
            this.uid = user.uid;

            // Load history as an observable (async pipe in template will handle subscription)
            this.history$ = this._ProfileService.getHistory(this.uid);

            // Return user profile data
            return this.UserService.getUserData(user.uid);
          }
          return of(null);
        }),
        takeUntil(this.destroy$) // Prevent memory leak
      )
      .subscribe(data => {
        this.profile = data?.data();
      });
  }

  logout() {
    // Sign out the user and navigate to sign-in page
    this.UserService.logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this._Router.navigate(['/signIn']);
      });
  }

  onFileSelected(event: Event) {
    // Update profile image when a file is selected
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.uid) {
      this.UserService.updateProfileImage(file, this.uid)
        .then((newImageUrl) => {
          this.profile.imageUrl = newImageUrl; 
        })
        .catch((err) => {
          console.error('Error updating profile image:', err);
        });
    }
  }

  removeItem(docId: string) {
    // Remove item from user's history
    this._ProfileService.removeFromHistory(this.uid, docId).then(() => {
      console.log('Item removed from history');
    });
  }
  clearAllHistory() {
    this._ProfileService.clearHistory(this.uid)
      .then(() => {
        console.log('All history removed');
      })
    .catch(err => console.error('Error removing all history:', err));

}

  goToMediaDetails(mediaType: string, mediaId: string): void {
    // Navigate to details page depending on media type
    if (mediaType === 'person') {
      this._Router.navigate(['person-details', mediaType, mediaId]);
    } else {
      this._Router.navigate(['media-details', mediaType, mediaId]);
    }
  }

  ngOnDestroy() {
    // Emit a signal to unsubscribe all observables
    this.destroy$.next();
    this.destroy$.complete();
  }
}