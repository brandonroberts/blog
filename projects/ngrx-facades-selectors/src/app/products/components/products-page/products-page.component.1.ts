import { Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ProductsFacadeService } from '../../../shared/state/products/products-facade.service';
import { CategoriesFacadeService } from '../../../shared/state/categories/categories-facade.service';
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
  allProducts$ = this.productsFacade.selectAllProducts$;
  allCategories$ = this.categoriesFacade.selectAllCategories$;

  products$ = combineLatest([
    this.allProducts$,
    this.allCategories$
  ]).pipe(
    tap(data => console.log('products/categories', data)),
    map(([products, categories]) => {
      return products.map(product => {
        const category = categories.find(category => category.id === product.categoryId);

        return {
          ...product,
          category: category ? category.name : ''
        };
      })
    })
  );

  constructor(
    private productsFacade: ProductsFacadeService,
    private categoriesFacade: CategoriesFacadeService
  ) {}

  ngOnInit() {
    this.productsFacade.dispatch(ProductActions.enter());
  }
}
