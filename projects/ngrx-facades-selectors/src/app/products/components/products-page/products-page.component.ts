import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';

import { ProductsFacadeService } from '../../../shared/state/products/products-facade.service';
import * as ProductActions from '../../../shared/state/products/product.actions';

@Component({
  selector: 'app-products-page',
  template: `
    <h2>
      Products
    </h2>

    <mat-list role="list">
      <mat-list-item role="listitem" *ngFor="let product of products$ | async">
        {{ product.name }} - {{ product.category }}
      </mat-list-item>
    </mat-list>
  `,
  styles: []
})
export class ProductsPageComponent implements OnInit {
  products$ = this.productsFacade.selectProductsAndCategories$
    .pipe(tap(data => console.log('products/categories', data)));

  constructor(
    private productsFacade: ProductsFacadeService
  ) {}

  ngOnInit() {
    this.productsFacade.dispatch(ProductActions.enter());
  }
}
