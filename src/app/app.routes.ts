import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { MediaCollectionComponent } from './media-collection/media-collection.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home-page', pathMatch: 'full' },
  { path: 'home-page', component: HomePageComponent },
  { path: 'about', component: AboutComponent },

  // المسارات الثابتة أولًا
  { path: 'media-collection/trending/all/day', component: MediaCollectionComponent },
  { path: 'media-collection/people', component: MediaCollectionComponent },

  // بعد كده الديناميكية
  { path: 'media-collection/:mediaType/:category', component: MediaCollectionComponent },

  { path: 'contact', component: ContactComponent },
  { path: '**', component: NotFoundComponent },
];
