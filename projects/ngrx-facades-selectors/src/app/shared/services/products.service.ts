import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';

import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  all() {
    return this.http.get<{ products: Product[] }>('/assets/products.json')
      .pipe(
        map(res => res.products),
        delay(3000)
      );
  }
}
