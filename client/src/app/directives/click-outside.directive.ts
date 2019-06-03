import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * Directive to close the a div on click of outside anywhere
 * @class ClickOutsideDirective
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  constructor(private _elementRef: ElementRef) { }

  @Output()
  public clickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit(event);
    }
  }

}

