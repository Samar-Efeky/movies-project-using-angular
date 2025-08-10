import { Component } from '@angular/core';
  import { RouterLink } from '@angular/router';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
@Component({
    selector: 'app-footer',
    imports: [RouterLink, AnimateOnVisibleDirective],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
    animations: [zoomIn,slideDown,slideUp]
})
export class FooterComponent {
  scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
}
