import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { slideDown, slideUp, zoomIn } from '../animations/animations';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';
@Component({
    selector: 'app-main-header-page',
    imports: [UpperCasePipe, CommonModule, AnimateOnVisibleDirective],
    templateUrl: './main-header-page.component.html',
    styleUrl: './main-header-page.component.css',
    animations: [slideDown, slideUp,zoomIn]
})
export class MainHeaderPageComponent implements OnChanges{
  @Input() mediaType!:string;
  @Input() category!:string;
  @Input() page!:string;
  media:string='';
  type:string='';
  ngOnChanges(): void {
    this.media=this.mediaType;
    this.media = this.media === 'person' ? 'people' : this.media;
    this.type=this.category;
    this.page=this.page;
  }
}
