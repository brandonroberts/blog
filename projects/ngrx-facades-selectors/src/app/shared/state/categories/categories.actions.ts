import { createAction, props } from '@ngrx/store';
import { Category } from '../../models/category';

export const loadCategories = createAction(
  '[Categories] Load Categories'
);

export const loadCategoriesSuccess = createAction(
  '[Categories] Load Categories Success',
  props<{ categories: Category[] }>()
);

export const loadCategoriesFailure = createAction(
  '[Categories] Load Categories Failure',
  props<{ error: string }>()
);
