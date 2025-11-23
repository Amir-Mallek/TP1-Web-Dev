import {Component, effect, signal} from "@angular/core";
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
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
  imports: [
    NgForOf,
    AsyncPipe,
    NgIf
  ],
  standalone: true
})
export class ProductsComponent {

  products$ = signal<Product[]>([]);
  private settings = signal({limit: 12, skip: 0} );
  private maxProducts =-1;
  private currentCount=0;
  constructor(private productService: ProductService) {
    effect(() => {
      const currentSettings = this.settings();
      this.productService.getProducts(this.settings()).subscribe(res =>{
        this.maxProducts = res.total;
        this.currentCount += res.products.length;
        this.products$.update(value => [...value, ...res.products])
      } )
    });
  }


  addMore() {
    if (this.currentCount < this.maxProducts) {
      this.settings.update(value => ({
        ...value,
        skip: value.skip + value.limit
      }));
    }
  }



}
