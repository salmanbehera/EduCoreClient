import { Directive, Input, Renderer2, ElementRef, OnChanges } from '@angular/core';

@Directive({
  selector: '[appReadonlyVisible]'
})
export class ReadonlyVisibleDirective implements OnChanges {
  @Input('appReadonlyVisible') isReadonly: boolean = false; // Controls readonly/disabled state
  @Input() isVisible: boolean = true; // Controls visibility

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    // Handle the readonly/disabled state
    if (this.isReadonly) {
      this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
    } else {
      this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
    }

    // Handle visibility
    if (!this.isVisible) {
      this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'display');
    }
  }
}
