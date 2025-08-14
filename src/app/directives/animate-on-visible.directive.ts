import { Directive, Input, HostBinding, ElementRef, OnInit, OnDestroy } from '@angular/core';
@Directive({
  selector: '[appAnimateOnScroll]', // Directive selector to use in templates
  standalone: true
})
export class AnimateOnVisibleDirective implements OnInit, OnDestroy {
  // Input to specify which animation to trigger
  @Input('appAnimateOnScroll') animationTriggerName!: string;

  // Bind animation states to the host element
  @HostBinding('@zoomIn') zoomInState: string = 'hidden';
  @HostBinding('@slideDown') slideDownState: string = 'hidden';
  @HostBinding('@slideUp') slideUpState: string = 'hidden';

  // IntersectionObserver instance to watch element visibility
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    // Initialize the observer to detect when the element enters the viewport
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Trigger the correct animation based on the input value
          switch (this.animationTriggerName) {
            case 'zoomIn':
              this.zoomInState = 'enter';
              break;
            case 'slideDown':
              this.slideDownState = 'enter';
              break;
            case 'slideUp':
              this.slideUpState = 'enter';
              break;
          }
          // Stop observing once the animation is triggered
          this.observer.disconnect();
        }
      });
    }, { threshold: 0.1}); // Trigger when 10% of the element is visible

    // Start observing the host element
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    // Ensure the observer is disconnected to avoid memory leaks
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
