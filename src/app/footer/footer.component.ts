import { Component } from '@angular/core';
  import { RouterLink } from '@angular/router';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink,AnimateOnVisibleDirective],
templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
