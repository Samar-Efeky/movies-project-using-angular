import {Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { FooterComponent } from "./footer/footer.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, SideBarComponent, RouterOutlet, FooterComponent,CommonModule],
templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'movies-project';
   moveLeft = false;
  isScrollButtonVisible: boolean = false;
  ngOnInit(): void {
  // Listen to scroll event
  window.addEventListener('scroll', this.onScroll.bind(this));
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
