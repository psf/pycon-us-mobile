import { Directive, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Capacitor } from '@capacitor/core';

@Directive({
  selector: '[appAutofill]'
})
export class AutofillDirective implements OnInit {

  constructor(
    private el: ElementRef,
    private ngControl: NgControl,
  ) {}

  ngOnInit(): void {
    if (Capacitor.getPlatform() !== 'ios') { return; }

    // Wait for ion-input to render its native input
    setTimeout(async () => {
      try {
        // Ionic 8: use getInputElement() to get the native input from shadow DOM
        const ionInput = this.el.nativeElement;
        const nativeInput = ionInput.getInputElement
          ? await ionInput.getInputElement()
          : ionInput.querySelector('input');

        if (!nativeInput) { return; }

        // Listen for both change and input events (iOS autofill fires change)
        const handler = () => {
          if (nativeInput.value && this.ngControl?.control) {
            this.ngControl.control.setValue(nativeInput.value);
            this.ngControl.control.markAsDirty();
          }
        };

        nativeInput.addEventListener('change', handler);
        nativeInput.addEventListener('input', handler);
      } catch { }
    }, 300);
  }
}
