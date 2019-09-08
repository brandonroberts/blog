import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProducts from './product.reducer';

export const selectProductsState = createFeatureSelector<fromProducts.State>(fromProducts.productFeatureKey);

export const selectAllProducts = createSelector(
  selectProductsState,
  fromProducts.getAll
);