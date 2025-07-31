import { Component } from '@angular/core';
import { MainHeaderPageComponent } from '../main-header-page/main-header-page.component';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [MainHeaderPageComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  animations: [zoomIn,slideDown,slideUp]
})
export class ContactComponent {

}
