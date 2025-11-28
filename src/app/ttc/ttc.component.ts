import {
  Component,
  computed,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-ttc',
    imports: [DecimalPipe],
    templateUrl: './ttc.component.html',
    styleUrl: './ttc.component.css'
})
export class TTCComponent {
  PriceHT: WritableSignal<number> = signal(0);
  TVA: WritableSignal<number> = signal(0);
  Quantity: WritableSignal<number> = signal(0);
  PriceUnitTTC: Signal<number> = computed(
    () => this.PriceHT() * (1 + this.TVA() / 100)
  );
  TotalTTC: Signal<number> = computed(() =>
    parseFloat((this.PriceUnitTTC() * this.Quantity()).toFixed(2))
  );
}
