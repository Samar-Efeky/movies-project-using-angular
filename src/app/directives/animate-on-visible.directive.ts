import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
@Directive({
  selector: '[appAnimateOnVisible]',
  standalone: true
})
export class AnimateOnVisibleDirective implements OnInit {
  // Input property to receive the animation class from the template
  // Default class is 'animate-fade-in' if not provided
  @Input('appAnimateOnVisible') animationClass: string = 'animate-fade-in';

  // Injecting ElementRef to access the DOM element
  // Injecting Renderer2 to safely manipulate the DOM
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Create an IntersectionObserver to detect when the element becomes visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element is at least 10% visible in the viewport
        if (entry.isIntersecting) {
          // Add the animation class to the element
          this.renderer.addClass(this.el.nativeElement, this.animationClass);
          
          // Stop observing after the animation is triggered once
          observer.disconnect();
        }
      },
      { threshold: 0.1 } // Trigger the observer when 10% of the element is visible
    );

    // Start observing the element
    observer.observe(this.el.nativeElement);
  }
}
