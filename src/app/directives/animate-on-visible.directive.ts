import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appAnimateOnVisible]',
  standalone: true
})
export class AnimateOnVisibleDirective {
   @Output() visible = new EventEmitter<boolean>(); 

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { 
          this.visible.emit(true); 
          this.observer.unobserve(this.el.nativeElement); 
        }
      });
    }, { threshold: 0.2 }); 

    this.observer.observe(this.el.nativeElement); 
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

}
