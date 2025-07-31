import { Component } from '@angular/core';
  import { RouterLink } from '@angular/router';
import { zoomIn } from '../animations/animations';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  animations: [zoomIn]
})
export class FooterComponent {
  scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
}
