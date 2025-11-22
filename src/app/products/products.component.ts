import { Component } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan, async, tap,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {

  products$!: Observable<Product[]>;
  private settingsSubject = new BehaviorSubject<Settings>({
    limit: 12,
    skip: 0
  });
  private maxProducts =-1;
  private currentCount=0;
  constructor(private productService: ProductService) {
    this.products$ = this.settingsSubject.pipe(
      concatMap(settings =>
        this.productService.getProducts(settings).pipe(
          tap(res => {
            this.maxProducts = res.total;
          }),
          map(res => res.products),
      )
  ),
      scan<Product[]>((allProducts:Product[], newProducts) => {
        const merged = [...allProducts, ...newProducts];
        this.currentCount=merged.length;
        return [...allProducts, ...newProducts];
      })

    );
  }

  addMore() {
    const old = this.settingsSubject.value;
    if(this.maxProducts==-1 || this.maxProducts > this.currentCount) {
      this.settingsSubject.next({
        ...old,
        skip: old.skip + old.limit
      });
    }
  }

}
