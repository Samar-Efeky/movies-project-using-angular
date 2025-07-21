import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutComponent } from './about/about.component';
import { MoviesComponent } from './movies/movies.component';
import { TvShowsComponent } from './tv-shows/tv-shows.component';
import { PeopleComponent } from './people/people.component';
import { TrendingComponent } from './trending/trending.component';
import { ContactComponent } from './contact/contact.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
    {path:'', redirectTo:"home-page", pathMatch:"full"},
    {path:"home-page" , component:HomePageComponent},
    {path:"about" , component:AboutComponent},
    {path:"movies" , component:MoviesComponent},
    {path:"TV-shows" , component:TvShowsComponent},
    {path:"people" , component:PeopleComponent},
    {path:"trending" , component:TrendingComponent},
    {path:"contact" , component:ContactComponent},
    {path:"**" , component:NotFoundComponent},
];
