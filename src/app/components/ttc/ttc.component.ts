import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-ttc',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ttc.component.html',
  styleUrl: './ttc.component.css'
})
export class TtcComponent {
  prixHT$ = new BehaviorSubject<number>(0);
  quantite$ = new BehaviorSubject<number>(1);
  tva$ = new BehaviorSubject<number>(18);

  discountPourcentage$ = this.quantite$.pipe(
    map(qte => {
      if (qte >= 10 && qte <= 15) return 0.2;
      if (qte > 15) return 0.3;
      return 0;
    })
  );

  prixUnitaireTTC$ = combineLatest([this.prixHT$, this.tva$]).pipe(
    map(([ht, tva]) => ht * (1 + tva / 100))
  );

  prixTotalTTC$ = combineLatest([
    this.prixUnitaireTTC$,
    this.quantite$,
    this.discountPourcentage$,
  ]).pipe(
    map(([pu, qte, discount]) => pu * qte * (1 - discount))
  );

  discount$ = combineLatest([
    this.prixUnitaireTTC$,
    this.quantite$,
    this.discountPourcentage$,
  ]).pipe(
    map(([pu, qte, discount]) => pu * qte * discount)
  );

  updatePrixHT(value: string): void {
    this.prixHT$.next(+value || 0);
  }

  updateQuantite(value: string): void {
    this.quantite$.next(+value || 1);
  }

  updateTVA(value: string): void {
    this.tva$.next(+value || 0);
  }
}
