import { Component } from '@angular/core';
  import { RouterLink } from '@angular/router';
import { zoomIn } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, AnimateOnVisibleDirective],
templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  animations: [zoomIn]
})
export class FooterComponent {
  overviewVisible = false;
  scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
}
