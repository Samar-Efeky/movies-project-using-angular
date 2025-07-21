import { Component } from '@angular/core';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AnimateOnVisibleDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

}
