import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  // Custom event emitted when the element becomes visible (lazy load trigger)
  @Output() appLazyLoad = new EventEmitter<void>();

  // Intersection Observer to watch the element
  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Initialize the Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];

      // Check if the element is in the viewport
      if (entry.isIntersecting) {
        this.appLazyLoad.emit(); // Emit the custom event
        this.observer.disconnect(); // Stop observing after first trigger
      }
    }, {
      threshold: 0.2, // Trigger when 20% of the element is visible
    });

    // Start observing the element
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    // Clean up the observer when the directive is destroyed
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}