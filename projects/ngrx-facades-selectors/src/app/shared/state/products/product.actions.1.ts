import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/product';

export const enter = createAction(
  '[Products Page] Enter'
);

export const loadProductsSuccess = createAction(
  '[Product/API] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Product/API] Load Products Failure',
  props<{ error: string }>()
);
