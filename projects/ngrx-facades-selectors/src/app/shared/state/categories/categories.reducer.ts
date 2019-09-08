import { Action, createReducer, on } from '@ngrx/store';
import * as CategoryActions from './categories.actions';
import * as ProductActions from '../products/product.actions';
import { Category } from '../../models/category';

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
  on(ProductActions.loadProductsSuccess, (state, action) => ({
    ...state,
    collection: action.categories,
    loaded: true
  })),
  on(ProductActions.loadProductsFailure, (state, action) => ({
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
