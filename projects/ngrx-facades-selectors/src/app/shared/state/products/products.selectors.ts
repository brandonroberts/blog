import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromProducts from './product.reducer';
import { selectAllCategories } from '../categories/categories.selectors';

export const selectProductsState = createFeatureSelector<fromProducts.State>(fromProducts.productFeatureKey);

export const selectAllProducts = createSelector(
  selectProductsState,
  fromProducts.getAll
);

export const selectProductsAndCategories = createSelector(
  selectAllProducts,
  selectAllCategories,
  (products, categories) => products.map(product => {
    const category = categories.find(category => category.id === product.categoryId);

    return {
      ...product,
      category: category ? category.name : ''
    };
  })
);
