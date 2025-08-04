import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MediaCollectionComponent } from './media-collection/media-collection.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { PersonProfileComponent } from './person-profile/person-profile.component';
import { SignInComponent } from './sign-in-component/sign-in-component';
import { SignUpComponent } from './sign-up-component/sign-up-component';
import { ProfileComponent } from './profile-component/profile-component';

export const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent },
  { path: 'about', component: AboutComponent },
  { path: 'media-collection/:mediaType', redirectTo: 'media-collection/:mediaType/popular', pathMatch: 'full' },
  { path: 'media-collection/:mediaType/:category', component: MediaCollectionComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'signIn',loadComponent: () => import('./sign-in-component/sign-in-component').then(m => m.SignInComponent) },
  { path: 'signUp', loadComponent: () => import('./sign-up-component/sign-up-component').then(m => m.SignUpComponent) },
  { path: 'profile', component: ProfileComponent},
  { path: 'media-details/:mediaType/:mediaId',loadComponent: () => import('./media-details/media-details.component').then(m => m.MediaDetailsComponent) },
  { path: 'person-details/:mediaType/:mediaId',loadComponent: () => import('./person-profile/person-profile.component').then(m => m.PersonProfileComponent) },
  { path: '**', component: NotFoundComponent },
];