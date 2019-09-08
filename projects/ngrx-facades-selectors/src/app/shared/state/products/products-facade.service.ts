import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';

import * as fromProducts from './products.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProductsFacadeService {
  selectAllProducts$ = this.store.select(fromProducts.selectAllProducts);
  selectProductsAndCategories$ = this.store.select(fromProducts.selectProductsAndCategories);

  constructor(private store: Store<{}>) { }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
