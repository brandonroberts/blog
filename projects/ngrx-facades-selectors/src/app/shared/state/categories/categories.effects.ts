import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { exhaustMap, map, catchError } from 'rxjs/operators';

import { CategoriesService } from '../../services/categories.service';

import * as CategoryActions from './categories.actions';
import * as ProductActions from '../products/product.actions';

@Injectable()
export class CategoriesEffects {

  loadCategories$ = createEffect(() => this.actions$.pipe(
    ofType(ProductActions.enter),
    exhaustMap(() =>
      this.categoriesService.all().pipe(
        map(categories => CategoryActions.loadCategoriesSuccess({ categories })),
        catchError(error => of(CategoryActions.loadCategoriesFailure({ error })))
      )
    )
  ));

  constructor(private actions$: Actions, private categoriesService: CategoriesService) {}

}
