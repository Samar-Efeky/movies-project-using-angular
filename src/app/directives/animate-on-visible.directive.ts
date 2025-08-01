import { AfterViewInit, Directive, ElementRef, EventEmitter, OnDestroy, Output } from '@angular/core';

@Directive({
  selector: '[appAnimateOnVisible]',
  standalone: true
})
export class AnimateOnVisibleDirective implements AfterViewInit, OnDestroy {
  @Output() visible = new EventEmitter<boolean>();

  private observer!: IntersectionObserver;
  private hasAnimated = false;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    // نأخر المراقبة شوية لضمان استقرار الصفحة
    setTimeout(() => {
      this.observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !this.hasAnimated) {
              this.visible.emit(true);
              this.hasAnimated = true; // مرة واحدة فقط
              this.observer.unobserve(this.el.nativeElement); // نوقف المراقبة
            }
          });
        },
        { threshold: 0.5}
      );

      this.observer.observe(this.el.nativeElement);
    }, 300); // وقت التأخير
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}