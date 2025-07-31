import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { slideDown, slideUp } from '../animations/animations';
@Component({
  selector: 'app-main-header-page',
  standalone: true,
  imports: [UpperCasePipe,CommonModule],
  templateUrl: './main-header-page.component.html',
  styleUrl: './main-header-page.component.css',
  animations: [slideDown,slideUp]
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
