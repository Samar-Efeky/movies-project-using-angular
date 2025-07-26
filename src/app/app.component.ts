import {Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FooterComponent } from "./footer/footer.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, SideBarComponent, RouterOutlet, FooterComponent],
templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'movies-project';
   moveLeft = false;

  onToggleSideBar() {
    this.moveLeft = !this.moveLeft; 
  }
}
