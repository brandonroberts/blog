import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';

import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  all() {
    return this.http.get<{ categories: Category[] }>('/assets/categories.json')
      .pipe(
        map(res => res.categories),
        delay(5000)
      );
  }
}
