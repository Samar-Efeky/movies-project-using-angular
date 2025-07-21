import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
@Directive({
  selector: '[appAnimateOnVisible]',
  standalone: true
})
export class AnimateOnVisibleDirective implements OnInit{
  @Input('appAnimateOnVisible') animationClass: string = 'animate-fade-in';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, this.animationClass);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(this.el.nativeElement);
  }
  

}
