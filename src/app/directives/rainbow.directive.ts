import { Directive, ElementRef, HostBinding, signal } from '@angular/core';

@Directive({
  selector: '[appRainbow]',
  standalone: true
})
export class RainbowDirective {
  private colors = ['red', 'orange', 'pink', 'green', 'blue', 'indigo', 'violet', 'brown'];
  private currentColor = signal(this.randomColor());

  @HostBinding('style.color') get textColor() {
    return this.currentColor();
  }

  @HostBinding('style.borderColor') get borderColor() {
    return this.currentColor();
  }

  constructor(private el: ElementRef<HTMLInputElement>) {
    el.nativeElement.addEventListener('keyup', () => {
      this.currentColor.set(this.randomColor());
    });
  }

  private randomColor() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

}
