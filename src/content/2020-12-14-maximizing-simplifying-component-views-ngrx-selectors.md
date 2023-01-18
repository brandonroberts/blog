---
title: 'Maximizing and Simplifying Component Views with NgRx Selectors'
description: 'Deriving data, composing selectors, and building view models efficiently with NgRx Selectors'
published: true
slug: 2020-12-14-maximizing-simplifying-component-views-ngrx-selectors
publishedDate: '2020-12-14 02:00 PM CST'
layout: ../../../layouts/BlogPostLayout.astro
---

<br/>

<a href="https://unsplash.com/@siora18?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" title="Siora Photography on Unsplash">
  <img src="/assets/posts/siora-photography-L06-OsgvNoM-unsplash.jpg" width="100%" height/>
</a>
 
When building Angular applications with NgRx for state management, one area that provides a lot of power and flexibility is in the usage of selectors. At a high level, selectors provide a few benefits to querying data in the store: efficient querying of data through memoization, composability to build up new data models, and synchronous access to operate with state. When reviewing projects and their usage of NgRx along with selectors, there are a few common trends that stick out including under-utilizing selectors for combining data, storing data that can be derived, and minimal usage of composed selectors to build view models. This post provides some practical examples in these areas to show how you can maximize and simplify your components using selectors by deriving state, combining and composing selectors together, and building view models from selectors for your components.

## Deriving State

There are many ways to slice up the data in the store to get the data you need for different views in your application. Derived data is a new combination of data produced from data that already exists in the store. Using a list of products as an example, let’s look at how you can use selectors to return different perspectives from the same dataset.

Let’s start with an interface for a product:

```ts
interface Product {
  id: string;
  name: string;
  description: string;
}
```

A example products state interface looks like this:

```ts
interface ProductsState {
  collection: Product[];
  loaded: boolean;
}
```

So what are some things you can derive, and transform this data? Here are a few examples.

Selecting the total number of products in the collection.

```ts
const selectTotalProducts = createSelector(
  selectProductsState,
  (state) => state.collection.length
);
```

Select the first 5 products from the collection:

```ts
const selectFirstFiveProducts = createSelector(selectProductsState, (state) =>
  state.collection.slice(0, 5)
);
```

Create a dictionary of products by id:

```ts
const selectProductsDictionary = createSelector(
  selectAllProducts,
  (products) => {
    let productsDictionary: { [id: number]: Product } = {};

    products.forEach((product) => {
      productsDictionary[product.id] = product;
    });

    return productsDictionary;
  }
);
```

These are just a few ways of deriving new data from the existing state, but you have many options depending on datasets you need to build.

## Composing Selectors

In the previous examples, selectors were built by accessing each property on the state, and returning a different set of data. Selectors are composable, in that you use selectors to build using other selectors, providing them as inputs. These input selectors can come from many different areas, even ones outside your immediate state. Taking the products example from above, the products collection is used in many different ways, and should be extracted into its own selector.

```ts
const selectAllProducts = createSelector(
  selectProductsState,
  (state) => state.collection
);
```

Now the total products selector use this selector as an input.

```ts
const selectTotalProducts = createSelector(
  selectAllProducts,
  (products) => products.length
);
```

Along with selecting the first 5 products from the collection.

```ts
const selectFirstFiveProducts = createSelector(selectAllProducts, (products) =>
  products.slice(0, 5)
);
```

A benefit you gain by using selectors to build other selectors is that selectors only recompute when they’re inputs change. By only listening to the collection instead of the entire state, the composed selectors will only re-run the projector function if the collection changes. The other benefit is that if a selector's inputs do change, but its computed value is the same, the previous value is returned, along with the same reference. This is where you get the added efficiency when using OnPush change detection. If the reference hasn’t changed, change detection doesn’t need to run again. To learn more about the ins and outs of change detection, read [Everything you need to know about change detection in Angular](https://indepth.dev/posts/1053/everything-you-need-to-know-about-change-detection-in-angular) over at [inDepthDev](https://indepth.dev).

To drive the composability of selectors even further, modify the products state to add a categoryId to each product.

```ts
interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
}
```

Along with products, add a slice of state to manage categories. The model for a category is similar to a product.

```ts
interface Category {
  id: string;
  name: string;
  description: string;
}
```

A example categories state interface looks like this:

```ts
interface CategoriesState {
  collection: Category[];
  loaded: boolean;
}
```

Apply the same approach to selecting all categories.

```ts
const selectAllCategories = createSelector(
  selectCategoriesState,
  (state) => state.collection
);
```

Create a dictionary of categories by id:

```ts
const selectCategoriesDictionary = createSelector(
  selectAllCategories,
  (categories) => {
    let categoriesDictionary: { [id: number]: Category } = {};

    categories.forEach((category) => {
      categoriesDictionary[category.id] = category;
    });

    return categoriesDictionary;
  }
);
```

Build on the same idea that selectors are composable to build a new dataset of products along with their associated category and title.

```ts
const selectProductsList = createSelector(
  selectAllProducts,
  selectCategoriesDictionary,
  (products, categoriesDictionary) => {
    return products.map(product => {
      return {
        ...product,
        title: `${product.name} details`,
        category: categoriesDictionary[product.categoryId] ? categoriesDictionary[product.categoryId].name : '';
      };
    });
```

**NgRx Tip:** The [@ngrx/entity](https://ngrx.io/guide/entity) package creates dictionaries of collections for you, and provides an adapter with methods, and selectors for working with collections out of the box.

<video width="100%" height="480" loop autoplay controls>
  <source src="/assets/posts/another-one.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

To create a new selector composed of the loaded properties of two states into one, use them as inputs to another selector.

Select if the collection is loaded:

```ts
const selectProductsLoaded = createSelector(
  selectProductsState,
  (state) => state.loaded
);
```

And select if the categories are loaded:

```ts
const selectCategoriesLoaded = createSelector(
  selectCategoriesState,
  (state) => state.loaded
);
```

Create an "is ready" selector to combine the other two selectors.

```ts
const selectIsViewReady = createSelector(
  selectProductsLoaded,
  selectCategoriesLoaded,
  (productsLoaded, categoriesLoaded) => [productsLoaded, categoriesLoaded].every(loaded => loaded === true);
```

In this example, when the returned value is updated whenever either of the loaded properties is updated, producing a single value of all the loaded states. All the state is already in the store, so the data can be combined before consuming it as an observable.

## Building View Models

When you are consuming many observables in your components, a good pattern to follow is to build a view model of the combined observables into one single observable that’s exposed to your template. This view model pattern is very popular in AngularJS, and Angular. In Angular, you only have to deal with unwrapping a single observable with the async pipe, and you’re able to work with the view model properties throughout the rest of your template.

A common pattern is to combine multiple observables using the `combineLatest` operator from RxJS in the component class.

```ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ProductListSelectors from './product-list.selectors';
import * as ProductsListActions from './product-list.actions';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  ready$ = this.store.select(ProductListSelectors.selectIsViewReady);
  products$ = this.store.select(ProductListSelectors.selectProductsList);
  vm$ = combineLatest([this.ready, this.products$]).pipe(
    map(([ready, products]) => ({ ready, products }))
  );

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(ProductsListActions.enter());
  }
}
```

Combining observables in RxJS using `combineLatest` or other combination operators have their place, but both observables are getting data from the _same_ global state object. And the combined observable will emit a value any time _either_ one of the observables emits a value after the first combined emission. This causes extra computations that aren't necessary when multiple pieces of state you are combining are updated at the same time. The more observables added to the `combineLatest` array results in more computations when multiple pieces of state are updated.

Building on top of composable selectors, you can achieve this same pattern, and keep the same efficiency in selecting data from the Store. In the previous selectors, there is a value for when the view is ready, and the list of products. Use these two selectors to build a view model selector for the product list component.

```ts
export const selectProductListViewModel = createSelector(
  selectIsViewReady,
  selectProductsList,
  (ready, products) => ({ ready, products })
);
```

A combined selector gives you fewer observables to manage, a single emission even when multiple slices of state used in the selector are updated in one state change event, and a clean view model to use in your component. Now instead of having multiple observables for ready status and the product list, there is a single view model observable.

```ts
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ProductListSelectors from './product-list.selectors';
import * as ProductsListActions from './product-list.actions';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  vm$ = this.store.select(ProductListSelectors.selectProductListViewModel);

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(ProductsListActions.enter());
  }
}
```

In the template, use the async pipe to subcribe to and assign the variable to the `vm` property, and access the properties on the view model in the template.

```html
<h2>Products</h2>

<ng-container *ngIf="vm$ | async as vm">
  <ng-container *ngIf="vm.ready;else loading">
    <div *ngFor="let product of vm.products">
      <h3>
        <a [title]="product.title" [routerLink]="['/products', product.id]">
          {{ product.name }}
        </a>
      </h3>
      <p *ngIf="product.description">Description: {{ product.description }}</p>

      <p *ngIf="product.category">Category: {{ product.category }}</p>
    </div>
  </ng-container>
</ng-container>

<ng-template #loading> Loading ... </ng-template>
```

In case you have more data for a view model, selectors can take up to 8 inputs to combine data. If you exceed that limit, break down your selectors into smaller units, and compose them back together into a single one. The component remains thin, and takes full advantage of observables through selectors provided through the Store. You can maximize and simplify component views with NgRx Selectors by deriving new data from existing data, composing selectors together, and building reactive view models for your component to consume.

To see a full working example that builds on top of the Angular Getting Started tutorial, check out this [repository](https://github.com/brandonroberts/maximize-simplify-ngrx-selectors).

Follow me on [Twitter](https://twitter.com/brandontroberts), [YouTube](https://youtube.com/brandonrobertsdev), [Twitch](https://twitch.tv/brandontroberts).
