import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, exhaustMap } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';

import * as ProductActions from './product.actions';
import { ProductsService } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';

@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.enter),
    exhaustMap(() =>
      forkJoin([
        this.productsService.all(),
        this.categoryService.all(),
      ]).pipe(
        map(([products, categories]) => ProductActions.loadProductsSuccess({ products, categories })),
        catchError(error => of(ProductActions.loadProductsFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private productsService: ProductsService,
    private categoryService: CategoriesService
  ) {}

}
