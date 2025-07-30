import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MediaCollectionComponent } from './media-collection/media-collection.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { PersonProfileComponent } from './person-profile/person-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'media-collection/:mediaType', redirectTo: 'media-collection/:mediaType/popular', pathMatch: 'full' },
  { path: 'media-collection/:mediaType/:category', component: MediaCollectionComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'media-details/:mediaType/:mediaId', component:MediaDetailsComponent},
  { path: 'person-details/:mediaType/:mediaId', component:PersonProfileComponent},
  { path: '**', component: NotFoundComponent },
];