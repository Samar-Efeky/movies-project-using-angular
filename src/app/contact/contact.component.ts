import { Component } from '@angular/core';
import { MainHeaderPageComponent } from '../main-header-page/main-header-page.component';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MainHeaderPageComponent, AnimateOnVisibleDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

}
