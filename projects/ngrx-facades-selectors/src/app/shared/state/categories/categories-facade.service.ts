import { Injectable } from '@angular/core';
import { Store, Action } from '@ngrx/store';

import * as fromCategories from './categories.selectors';

@Injectable({
  providedIn: 'root'
})
export class CategoriesFacadeService {
  selectAllCategories$ = this.store.select(fromCategories.selectAllCategories);

  constructor(private store: Store<{}>) { }

  dispatch(action: Action) {
    this.store.dispatch(action);
  }
}
