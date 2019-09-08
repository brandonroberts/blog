import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as ProductActions from './product.actions.1';
import { ProductsService } from '../../services/products.service';

@Injectable()
export class ProductEffects {
  loadProducts$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.enter),
    exhaustMap(() => this.productsService.all().pipe(
        map(products => ProductActions.loadProductsSuccess({ products })),
        catchError(error => of(ProductActions.loadProductsFailure({ error })))
      )
    )
  ));

  constructor(
    private actions$: Actions,
    private productsService: ProductsService
  ) {}

}
