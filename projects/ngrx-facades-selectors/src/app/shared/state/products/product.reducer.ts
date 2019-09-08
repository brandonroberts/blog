import { Action, createReducer, on } from '@ngrx/store';
import * as ProductActions from './product.actions';
import { Product } from '../../models/product';

export const productFeatureKey = 'products';

export interface State {
  collection: Product[];
  loaded: boolean;
}

export const initialState: State = {
  collection: [],
  loaded: false
};

const productReducer = createReducer(
  initialState,
  on(ProductActions.enter, () => initialState),
  on(ProductActions.loadProductsSuccess, (state, action) => ({
    ...state,
    collection: action.products,
    loaded: true
  })),
  on(ProductActions.loadProductsFailure, (state, action) => ({
    ...state,
    error: action.error,
    loaded: false
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return productReducer(state, action);
}

export const getAll = (state: State) => state.collection;
export const getLoaded = (state: State) => state.loaded;