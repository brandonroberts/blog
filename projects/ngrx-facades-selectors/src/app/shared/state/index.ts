import { ActionReducerMap } from '@ngrx/store';
import * as fromProducts from './products/product.reducer';
import * as fromCategories from './categories/categories.reducer';

export interface State {
  products: fromProducts.State;
  categories: fromCategories.State;
}

export const reducers: ActionReducerMap<State, any> = {
  products: fromProducts.reducer,
  categories: fromCategories.reducer
};

