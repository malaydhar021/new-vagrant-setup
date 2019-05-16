import { Directive, Input, Output, EventEmitter, HostListener } from "@angular/core";

/**
 * Directive to copy to clipboard on click
 * @class CopyToClipboardDirective
 * @version 1.0.0
 * @author Tier5 LLC `<work@tier5.us>`
 * @license Proprietary
 */
@Directive({ 
  selector: '[copyToClipboard]' 
})
export class CopyToClipboardDirective {
  // input from element. this is not in use for now
  @Input("copy-clipboard")
  public payload: string;
  // the context which will be copied when someone click on copy button
  @Input("context")
  public context: string; // property to hold the context data
  // defining an event when copied
  @Output("copied")
  public copied: EventEmitter<string> = new EventEmitter<string>();
  // this will listen when copy snippet has been clicked
  @HostListener("click", ["$event"])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    if (!this.context)
      return;

    let listener = (e: ClipboardEvent) => {
      let clipboard = e.clipboardData || window["clipboardData"];
      clipboard.setData("text", this.context.toString());
      e.preventDefault();
      this.copied.emit(this.context);
    };

    document.addEventListener("copy", listener, false)
    document.execCommand("copy");
    document.removeEventListener("copy", listener, false);
  }
}