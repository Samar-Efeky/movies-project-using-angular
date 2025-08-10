import { Component } from '@angular/core';
import { MainHeaderPageComponent } from '../main-header-page/main-header-page.component';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MainHeaderPageComponent,AnimateOnVisibleDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  animations: [zoomIn, slideDown, slideUp]
})
export class ContactComponent {}
