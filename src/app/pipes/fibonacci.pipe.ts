import { Pipe, PipeTransform } from '@angular/core';
import memo from 'memo-decorator';

@Pipe({
  name: 'fibo',
  pure: true,
})
export class FibonacciPipe implements PipeTransform {

  @memo()
  fibonnaci(n: number): number {
    console.log("calculating this for the first time: ", n);

    if (n == 1 || n == 0) {
      return 1;
    }
    return this.fibonnaci(n - 1) + this.fibonnaci(n - 2);
  }

  transform(n: number): number {
    return this.fibonnaci(n);
  }
}