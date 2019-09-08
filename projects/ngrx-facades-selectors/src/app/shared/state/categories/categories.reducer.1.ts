import { Action, createReducer, on } from '@ngrx/store';

import { Category } from '../../models/category';
import * as CategoryActions from './categories.actions';
import * as ProductActions from '../products/product.actions';

export const categoriesFeatureKey = 'categories';

export interface State {
  collection: Category[];
  loaded: boolean;
}

export const initialState: State = {
  collection: [],
  loaded: false
};

const categoriesReducer = createReducer(
  initialState,
  on(ProductActions.enter, () => initialState),
  on(CategoryActions.loadCategoriesSuccess, (state, action) => ({
      ...state,
      collection: action.categories,
      loaded: true
  })),
  on(CategoryActions.loadCategoriesFailure, (state, action) => ({
    ...state,
    error: action.error,
    loaded: false
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return categoriesReducer(state, action);
}

export const getAll = (state: State) => state.collection;
export const getLoaded = (state: State) => state.loaded;
