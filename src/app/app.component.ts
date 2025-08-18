import {Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FooterComponent } from "./footer/footer.component";

import { slideInOut } from './animations/animations';
import { ChatComponent } from './chat-component/chat-component';
import { LoadingComponent } from './loading-component/loading-component';
@Component({
    selector: 'app-root',
    imports: [NavbarComponent, SideBarComponent, RouterOutlet, FooterComponent,ChatComponent,LoadingComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    animations: [slideInOut]
})
export class AppComponent implements OnInit{
  title = 'movies-project';
   moveLeft = false;
  
  isScrollButtonVisible: boolean = false;
  ngOnInit(): void {
  // Listen to scroll event
  window.addEventListener('scroll', this.onScroll.bind(this));
}
onSideBarToggleByScreen(shouldShow: boolean) {
  this.moveLeft = shouldShow;
}
onScroll(): void {
  this.isScrollButtonVisible = window.scrollY > 300;
}
scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
  onToggleSideBar() {
    this.moveLeft = !this.moveLeft; 
  }
}
