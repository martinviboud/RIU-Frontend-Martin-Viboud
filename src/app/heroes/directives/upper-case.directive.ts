import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
    selector: '[appUpperCase]',
    standalone: true
})
export class UpperCaseDirective {

  private readonly el = inject(ElementRef);

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.el.nativeElement.value = value.toUpperCase();
    this.el.nativeElement.dispatchEvent(new Event('input'));
  }
}
