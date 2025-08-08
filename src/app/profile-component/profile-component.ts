import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { ProfileService } from '../services/profile-service';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { Router} from '@angular/router';
import { SeeMorePipe } from '../pipes/see-more.pipe';
@Component({
  selector: 'app-profile-component',
  imports: [CommonModule, SeeMorePipe],
templateUrl: './profile-component.html',
  styleUrl: './profile-component.css'
})
export class ProfileComponent implements OnInit {
  profile: any;
  uid: string = '';
  history$: Observable<any[]> = of([]);
  favorites$: Observable<any[]> = of([]);

  constructor(private UserService: UserService, private _ProfileService: ProfileService,
     private _Router: Router) {}

  ngOnInit() {
    this.UserService.currentUser$.pipe(
      switchMap(user => {
        if (user) {
          this.uid = user.uid;
          this.history$ = this._ProfileService.getHistory(this.uid);
          return this.UserService.getUserData(user.uid);
        }
        return of(null);
      })
    ).subscribe(data => {
      this.profile = data?.data();
    });
  }

  logout() {
    this.UserService.logout().subscribe(() => {
      this._Router.navigate(['/signIn']);
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file && this.uid) {
      this.UserService.updateProfileImage(file, this.uid)
        .then((newImageUrl) => {
          this.profile.imageUrl = newImageUrl; 
        })
        .catch((err) => {
          console.error('حدث خطأ أثناء تحديث الصورة:', err);
        });
    }
  }

  removeItem(docId: string) {
    this._ProfileService.removeFromHistory(this.uid, docId).then(() => {
      console.log('تم الحذف من التاريخ');
    });
  }
  goToMediaDetails(mediaType: string, mediaId: string): void {
    if (mediaType == 'person') {
      this._Router.navigate(['person-details', mediaType, mediaId]);
    } else {
      this._Router.navigate(['media-details', mediaType, mediaId]);
    }
  }
}
