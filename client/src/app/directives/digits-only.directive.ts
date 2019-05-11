import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * Directive to allow only digits into a input box. Also it allows actions like
 * `copy`, `paste`, `delete`, `tab` etc. All allowed actions are defined in a class
 * property called `navigationKeys`. Please see the url for further reference.
 * @class DigitsOnlyDirective
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @see https://codeburst.io/digit-only-directive-in-angular-3db8a94d80c3
 * @license Proprietary
 */
@Directive({
  selector: '[digitsOnly]'
})
export class DigitsOnlyDirective {
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste'
  ];
  inputElement: HTMLElement;
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  /**
   * Decorator that listens to onKeyDown event to allow only numbers
   * @param e Keyboard event
   * @returns Void
   */
  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    if (
      this.navigationKeys.indexOf(e.key) > -1 || // Allow: navigation keys: backspace, delete, arrows etc.
      (e.key === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.key === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
      (e.key === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.key === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.key === 'a' && e.metaKey === true) || // Allow: Cmd+A (Mac)
      (e.key === 'c' && e.metaKey === true) || // Allow: Cmd+C (Mac)
      (e.key === 'v' && e.metaKey === true) || // Allow: Cmd+V (Mac)
      (e.key === 'x' && e.metaKey === true) // Allow: Cmd+X (Mac)
    ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  }

  /**
   * Decorator that listens to onPaste event and prevent it
   * @param event Input event
   * @returns Void
   */
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData.getData('text/plain').replace(/\D/g, ''); // get a digit-only string
    document.execCommand('insertText', false, pastedInput);
  }

  /**
   * Decorator that listens to onDrop event and prevent it
   * @param event Input event
   * @returns Void
   */
  @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text').replace(/\D/g, '');
    this.inputElement.focus();
    document.execCommand('insertText', false, textData);
  }
}