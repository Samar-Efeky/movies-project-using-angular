
import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AnimateOnVisibleDirective],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 
}
