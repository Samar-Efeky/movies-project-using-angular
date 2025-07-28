import { UpperCasePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AnimateOnVisibleDirective } from '../directives/animate-on-visible.directive';

@Component({
  selector: 'app-main-header-page',
  standalone: true,
  imports: [UpperCasePipe, AnimateOnVisibleDirective],
  templateUrl: './main-header-page.component.html',
  styleUrl: './main-header-page.component.css'
})
export class MainHeaderPageComponent implements OnChanges{
  @Input() mediaType!:string;
  @Input() category!:string;
  media:string='';
  type:string='';
  ngOnChanges(): void {
    this.media=this.mediaType;
    this.media = this.media === 'person' ? 'people' : this.media;
    this.type=this.category;
  }
}
